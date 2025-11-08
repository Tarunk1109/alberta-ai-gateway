import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai"; // ✅ default import (important!)
import { MongoClient, ObjectId } from "mongodb"; // <-- Make sure ObjectId is imported
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

// ---- Environment Checks
if (!process.env.MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in server/.env");
  process.exit(1);
}
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY in server/.env");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("❌ Missing JWT_SECRET in server/.env (add a long random string)");
  process.exit(1);
}

// ---- Mongo (connect once)
const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();
  console.log("✅ Connected to MongoDB");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
}

const db = client.db("alberta");
const groups = db.collection("groups");
const guides = db.collection("guides");
const itineraries = db.collection("itineraries");
const users = db.collection("users");

// ---- OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===================================
// ---- AUTH MIDDLEWARE ----
// ===================================
// This function will check for a valid token on protected routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user payload (which contains userId) to the request object
    req.user = decoded; 
    next();
  } catch (e) {
    res.status(401).json({ error: "Token is not valid" });
  }
};


// ---- Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ---- Quick weather note (optional, non-blocking style)
async function getWeatherNote(city) {
  try {
    if (!city || !process.env.OPENWEATHER_API_KEY) return "";
    const q = encodeURIComponent(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const w = await fetch(url).then((r) => r.json());

    if (w?.weather?.[0]?.description && w?.main?.temp != null) {
      return `Weather: ${w.weather[0].description}, ${Math.round(
        w.main.temp
      )}°C.`;
    }
  } catch (e) {
    console.warn("Weather fetch failed:", e.message);
  }
  return "";
}

// ---- 1) PLAN itinerary
app.post("/api/plan", async (req, res) => {
  try {
    const { prompt, lang = "en", city = "Banff", dates = [] } = req.body;

    const weatherNote = await getWeatherNote(city);
    const checkedAtMST = new Date().toLocaleString("en-CA", {
      timeZone: "America/Edmonton",
    });

    const system = `You are an Alberta travel planner. Reply in ${lang}.
Return JSON only with this shape:
{
  "days":[
    {"title":"Day X Title","stops":[{"name":"","why":"","source":"https://www.travelalberta.com"}]}
  ],
  "notes":[]
}
If a weather note is provided, add ONE short sentence into "notes". Keep names real, concise.`;

    const user = `Request: ${prompt}
City: ${city}
WeatherNote: ${weatherNote}
Dates: ${Array.isArray(dates) ? dates.join(", ") : ""}`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const content = resp.choices?.[0]?.message?.content || "{}";
    const plan = JSON.parse(content);

    // We removed the old fire-and-forget save.
    // We will now only save if the user clicks "Save Plan".
    // itineraries
    //   .insertOne({
    //     plan,
    //     createdAt: new Date(),
    //     city,
    //     weatherNote,
    //   })
    //   .catch(console.error);

    // Add a generated title to the plan object for saving later
    const planTitle = `AI Plan: ${prompt.substring(0, 40)}...`;
    plan.title = planTitle; // Add title to the plan object
    plan.prompt = prompt; // Add prompt to the plan object

    res.json({ plan, weatherNote, checkedAtMST }); // Return plan with new title
  } catch (e) {
    console.error("/api/plan error", e);
    res
      .status(500)
      .json({ error: "planner_failed", message: e.message || "Unknown error" });
  }
});

// ---- 2) Speech-to-Text (Whisper): audio(base64 data URL) -> text
app.post("/api/stt", async (req, res) => {
  try {
    const { audioBase64 } = req.body;
    if (!audioBase64?.startsWith("data:")) {
      return res.status(400).json({ error: "invalid_audio" });
    }

    const base664 = audioBase64.split(",")[1];
    const buff = Buffer.from(base664, "base64");

    // Node 20+ has File globally; if not, we could swap to a stream
    const file = new File([buff], "speech.webm", { type: "audio/webm" });

    const tr = await openai.audio.transcriptions.create({
      file,
      model: "whisper-1",
    });

    res.json({ text: tr.text || "" });
  } catch (e) {
    console.error("/api/stt error", e);
    res
      .status(500)
      .json({ error: "stt_failed", message: e.message || "Unknown error" });
  }
});

// ---- 3) Text-to-Speech: text -> mp3 base64
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "alloy" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "no_text" });
    }

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text,
      format: "mp3",
    });

    const buf = Buffer.from(await speech.arrayBuffer());
    res.json({
      audioBase64: `data:audio/mp3;base64,${buf.toString("base64")}`,
    });
  } catch (e) {
    console.error("/api/tts error", e);
    res
      .status(500)
      .json({ error: "tts_failed", message: e.message || "Unknown error" });
  }
});

// ---- 4) Group join (mock-safe)
app.post("/api/group/join", async (req, res) => {
  try {
    const { destination, date, user = "guest@demo" } = req.body;
    const key = `${destination}:${date}`;

    let g = await groups.findOne({ key });
    if (!g) {
      g = {
        key,
        destination,
        date,
        max: 10,
        members: [],
        status: "forming",
      };
      await groups.insertOne(g);
    }

    if (!g.members.includes(user) && g.members.length < g.max) {
      await groups.updateOne(
        { key },
        { $addToSet: { members: user } }
      );
      g = await groups.findOne({ key });
    }

    const guide =
      (await guides.findOne({ verified: true })) || {
        name: "Demo Guide",
        contact: "guide@demo",
      };

    const filled = g.members.length >= g.max;

    res.json({ group: g, guide, filled });
  } catch (e) {
    console.error("/api/group/join error", e);
    res
      .status(500)
      .json({ error: "group_failed", message: e.message || "Unknown error" });
  }
});

// ---- 5) Privacy (static)
app.get("/api/privacy", (_req, res) => {
  res.json({
    mic: "Used only to transcribe your request. No recordings stored.",
    location: "Used for weather and nearby places during the session.",
    delete: "Request deletion in-app anytime.",
  });
});

// ---- 6) General Chatbot about Alberta
app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], lang = "en" } = req.body;

    const limited = messages.slice(-10); // cap history

    const system = `You are a helpful assistant focused on Alberta, Canada.
Answer briefly and clearly in ${lang}.
Topics: culture, Indigenous heritage (respectful), education & universities,
trade & industries (energy, tech, agriculture), sports & major events, tourism.
If you don't know, say so. Keep it factual and neutral.`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        ...limited.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
    });

    const text = resp.choices?.[0]?.message?.content || "";
    res.json({ reply: text });
  } catch (e) {
    console.error("/api/chat error", e);
    res
      .status(500)
      .json({ error: "chat_failed", message: e.message || "Unknown error" });
  }
});

// ===================================
// ---- 7) AUTH SIGNUP ----
// ===================================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    // Check if user already exists
    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = await users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash, // Store the hashed password
      createdAt: new Date(),
    });

    // Create a token (JWT)
    const token = jwt.sign(
      { userId: newUser.insertedId.toHexString(), name: name, email: email.toLowerCase() }, // <-- .toHexString()
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Send back token and user info (excluding password)
    res.status(201).json({
      token,
      user: {
        id: newUser.insertedId,
        name: name,
        email: email.toLowerCase(),
      },
    });
  } catch (e) {
    console.error("/api/signup error", e);
    res
      .status(500)
      .json({ error: "Signup failed", message: e.message || "Unknown error" });
  }
});

// ===================================
// ---- 8) AUTH LOGIN ----
// ===================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find the user
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create a token (JWT)
    const token = jwt.sign(
      { userId: user._id.toHexString(), name: user.name, email: user.email }, // <-- .toHexString()
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send back token and user info
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error("/api/login error", e);
    res
      .status(500)
      .json({ error: "Login failed", message: e.message || "Unknown error" });
  }
});

// ===================================
// ---- 9) GET CURRENT USER ----
// ===================================
// This route is protected by the authMiddleware
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    // req.user is added by authMiddleware and contains the token payload
    const { userId } = req.user;

    // Find user in MongoDB, but exclude the passwordHash
    const user = await users.findOne(
      { _id: new ObjectId(userId) },
      { projection: { passwordHash: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Rename _id to id
    user.id = user._id;
    delete user._id;

    res.status(200).json({ user });

  } catch (e) {
    console.error("/api/me error", e);
    res
      .status(500)
      .json({ error: "Failed to fetch user", message: e.message || "Unknown error" });
  }
});

// ===================================
// ---- 10) NEW: SAVE A PLAN ----
// ===================================
// This route is protected
app.post("/api/my-plans", authMiddleware, async (req, res) => {
  try {
    const { plan, weatherNote } = req.body;
    const { userId } = req.user; // Get userId from the verified token

    if (!plan || !plan.days) {
      return res.status(400).json({ error: "Invalid plan data" });
    }
    
    // Save the plan to the itineraries collection, linked to the user
    const savedPlan = await itineraries.insertOne({
      userId: new ObjectId(userId), // Link to the user
      plan,
      weatherNote: weatherNote || "",
      prompt: plan.prompt || "",
      title: plan.title || "My AI Plan",
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, planId: savedPlan.insertedId });
  } catch (e) {
    console.error("/api/my-plans (POST) error", e);
    res
      .status(500)
      .json({ error: "Failed to save plan", message: e.message || "Unknown error" });
  }
});

// ===================================
// ---- 11) NEW: GET SAVED PLANS ----
// ===================================
// This route is protected
app.get("/api/my-plans", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user; // Get userId from the verified token

    // Find all plans for this user, sort by newest first
    const plans = await itineraries
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Rename _id to id for consistency
    const formattedPlans = plans.map(p => {
      p.id = p._id;
      delete p._id;
      return p;
    });

    res.status(200).json({ plans: formattedPlans });
  } catch (e) {
    console.error("/api/my-plans (GET) error", e);
    res
      .status(500)
      .json({ error: "Failed to fetch plans", message: e.message || "Unknown error" });
  }
});


// ---- Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 API on http://localhost:${PORT}`);
});