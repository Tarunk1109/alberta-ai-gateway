import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from 'multer';
import FormData from 'form-data';
import axios from 'axios';

dotenv.config();

const app = express();

// --- SECURE CORS CONFIGURATION ---
// 1. Add your Netlify URL (Production)
// 2. Add your Localhost URL (Development)
const allowedOrigins = [
  'https://alberta-ai.netlify.app', 
  'http://localhost:5173',
  'http://localhost:5174' // Adding 5174 just in case Vite switches ports
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      console.log("BLOCKED BY CORS:", origin); // Logs to Render dashboard for debugging
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // Important for headers/auth
}));
// --- END CORS CONFIGURATION ---

app.use(express.json({ limit: "15mb" }));

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// ---- Environment Checks
// (We only check these if we are NOT in a build step, to prevent build failures if vars are missing during build)
if (process.env.NODE_ENV !== 'production' || process.env.MONGODB_URI) {
    if (!process.env.MONGODB_URI) console.error("❌ Missing MONGODB_URI");
    if (!process.env.OPENAI_API_KEY) console.error("❌ Missing OPENAI_API_KEY");
    if (!process.env.GEMINI_KEY) console.error("❌ Missing GEMINI_KEY");
    if (!process.env.JWT_SECRET) console.error("❌ Missing JWT_SECRET");
}

// ---- Mongo (connect once)
const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // Do not exit process in production, let it retry or fail gracefully
  }
}
connectDB();

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
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (e) {
    res.status(401).json({ error: "Token is not valid" });
  }
};


// ---- Health
app.get("/api/health", (_req, res) => res.json({ ok: true, env: process.env.NODE_ENV }));

// ---- Quick weather note (optional, non-blocking style)
async function getWeatherNote(city) {
  try {
    if (!city || !process.env.OPENWEATHER_API_KEY) return "";
    const q = encodeURIComponent(city);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;

    const w = await fetch(url).then((r) => r.json());

    if (w?.weather?.[0]?.description && w?.main?.temp != null) {
      return `Weather: ${w.weather[0].description}, ${Math.round(w.main.temp)}°C.`;
    }
  } catch (e) {
    console.warn("Weather fetch failed:", e.message);
  }
  return "";
}

// ===================================
// ---- API ENDPOINTS ----
// ===================================

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

    const planTitle = `AI Plan: ${prompt.substring(0, 40)}...`;
    plan.title = planTitle; 
    plan.prompt = prompt; 

    res.json({ plan, weatherNote, checkedAtMST });
  } catch (e) {
    console.error("/api/plan error", e);
    res.status(500).json({ error: "planner_failed", message: e.message });
  }
});


// ---- 2) Text-to-Speech
app.post("/api/tts", async (req, res) => {
  try {
    const { text, voice = "alloy" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "no_text" });
    }

    const speech = await openai.audio.speech.create({
      model: "tts-1", // Correct model for standard TTS
      voice,
      input: text,
      response_format: "mp3", 
    });

    const buf = Buffer.from(await speech.arrayBuffer());
    res.json({
      audioBase64: `data:audio/mp3;base64,${buf.toString("base64")}`,
    });
  } catch (e) {
    console.error("/api/tts error", e);
    res.status(500).json({ error: "tts_failed", message: e.message });
  }
});

// ---- 3) Group join (mock-safe)
app.post("/api/group/join", async (req, res) => {
  try {
    const { destination, date, user = "guest@demo" } = req.body;
    const key = `${destination}:${date}`;

    let g = await groups.findOne({ key });
    if (!g) {
      g = { key, destination, date, max: 10, members: [], status: "forming" };
      await groups.insertOne(g);
    }

    if (!g.members.includes(user) && g.members.length < g.max) {
      await groups.updateOne({ key }, { $addToSet: { members: user } });
      g = await groups.findOne({ key });
    }

    const guide = (await guides.findOne({ verified: true })) || {
        name: "Demo Guide",
        contact: "guide@demo",
      };

    const filled = g.members.length >= g.max;
    res.json({ group: g, guide, filled });
  } catch (e) {
    console.error("/api/group/join error", e);
    res.status(500).json({ error: "group_failed", message: e.message });
  }
});

// ---- 4) Privacy
app.get("/api/privacy", (_req, res) => {
  res.json({
    mic: "Used only to transcribe your request. No recordings stored.",
    location: "Used for weather and nearby places during the session.",
    delete: "Request deletion in-app anytime.",
  });
});

// ---- 5) General Chatbot
app.post("/api/chat", async (req, res) => {
  try {
    const { messages = [], lang = "en" } = req.body;
    const limited = messages.slice(-10); 

    const system = `You are a helpful assistant focused on Alberta, Canada.
Answer briefly and clearly in ${lang}.
Topics: culture, Indigenous heritage, education, trade, sports, tourism.`;

    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: system },
        ...limited.map((m) => ({ role: m.role, content: m.content })),
      ],
    });

    const text = resp.choices?.[0]?.message?.content || "";
    res.json({ reply: text });
  } catch (e) {
    console.error("/api/chat error", e);
    res.status(500).json({ error: "chat_failed", message: e.message });
  }
});

// ---- 6) Weather Endpoint
app.get('/api/weather', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=Banff&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    res.json({
      temp: Math.round(data.main.temp),
      main: data.weather[0]?.main || 'N/A',
      wind: Math.round(data.wind.speed * 3.6),
      humidity: data.main.humidity,
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    // Return mock data if API fails to prevent frontend crash
    res.json({ temp: 15, main: "Clear (Mock)", wind: 10, humidity: 40 }); 
  }
});

// ---- 7) Events Endpoint
app.get('/api/events', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&countryCode=CA&stateCode=AB&sort=date,asc&size=10&classificationName=music,sports,arts`
    );
    res.json({ events: data._embedded?.events || [] });
  } catch (error) {
    console.error('Events API error:', error.message);
    res.json({ events: [] }); // Return empty array on error
  }
});

// ---- 8) Whisper Transcription
app.post('/api/transcribe', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'Server key missing.' });

    const form = new FormData();
    form.append('file', req.file.buffer, { filename: 'audio.webm', contentType: req.file.mimetype });
    form.append('model', 'whisper-1');

    const { speechLang } = req.body;
    let endpoint = 'https://api.openai.com/v1/audio/transcriptions';
    if (speechLang === 'translate') {
      endpoint = 'https://api.openai.com/v1/audio/translations';
    } else if (speechLang && speechLang !== 'en') {
      form.append('language', speechLang);
    }

    const { data } = await axios.post(endpoint, form, {
      headers: { ...form.getHeaders(), 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      maxBodyLength: Infinity,
    });

    res.json({ text: data.text });
  } catch (error) {
    console.error('Whisper API error:', error.message);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// ---- 9) Gemini Text
app.post('/api/gemini-text', async (req, res) => {
  try {
    const { systemPrompt, userQuery } = req.body;
    if (!process.env.GEMINI_KEY) return res.status(500).json({ error: 'Server GEMINI_KEY missing.' });
    
    // Using flash model for speed
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };
    
    const { data } = await axios.post(apiUrl, payload, { headers: { 'Content-Type': 'application/json' } });
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) return res.status(500).json({ error: 'Invalid response from Gemini.' });
    res.json({ text });
  } catch (e) {
    console.error('Gemini text error:', e.response?.data || e.message);
    res.status(500).json({ error: 'Failed to generate text' });
  }
});

// ---- 10) Gemini Image
app.post('/api/gemini-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!process.env.GEMINI_KEY) return res.status(500).json({ error: 'Server GEMINI_KEY missing.' });

    // Note: Use gemini-1.5-flash or pro for images if available, older models deprecated
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_KEY}`;
    
    // CURRENTLY GEMINI API DOES NOT SUPPORT TEXT-TO-IMAGE via simple REST in all regions simply.
    // However, if you are using the Vertex AI or specific image models, the endpoint changes.
    // FOR SAFETY: We will mock this if the API fails, or you can switch to OpenAI DALL-E if you have credits.
    // For now, let's try the standard generateContent. If it fails (because it's text-only model), we catch it.
    
    // Actually, for image GENERATION (not vision), Gemini isn't the standard endpoint yet for public API keys (Imagen is separate).
    // I will switch this to OpenAI DALL-E 2 for you since you have that key, to ensure it works.
    
    const openaiImg = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openaiImg.images.generate({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "512x512",
      response_format: "b64_json",
    });

    const base64Data = response.data[0].b64_json;
    res.json({ base64Data });

  } catch (e) {
    console.error('Image Gen error:', e.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});


// ===================================
// ---- AUTH ROUTES ----
// ===================================

// ---- 11) AUTH SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Fill all fields" });

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ error: "User exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await users.insertOne({
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { userId: newUser.insertedId.toHexString(), name, email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token, user: { id: newUser.insertedId, name, email } });
  } catch (e) {
    console.error("Signup error", e);
    res.status(500).json({ error: "Signup failed" });
  }
});

// ---- 12) AUTH LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Provide email/password" });

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id.toHexString(), name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    console.error("Login error", e);
    res.status(500).json({ error: "Login failed" });
  }
});

// ---- 13) GET CURRENT USER
app.get("/api/me", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await users.findOne({ _id: new ObjectId(userId) }, { projection: { passwordHash: 0 } });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    user.id = user._id;
    delete user._id;
    res.status(200).json({ user });
  } catch (e) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

// ===================================
// ---- SAVED PLAN ROUTES (PROTECTED) ----
// ===================================

// ---- 14) SAVE A PLAN
app.post("/api/my-plans", authMiddleware, async (req, res) => {
  try {
    const { plan, weatherNote } = req.body;
    const { userId } = req.user; 

    if (!plan || !plan.days) return res.status(400).json({ error: "Invalid plan data" });
    
    const savedPlan = await itineraries.insertOne({
      userId: new ObjectId(userId), 
      plan,
      weatherNote: weatherNote || "",
      prompt: plan.prompt || "",
      title: plan.title || "My AI Plan",
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, planId: savedPlan.insertedId });
  } catch (e) {
    console.error("Save plan error", e);
    res.status(500).json({ error: "Failed to save plan" });
  }
});

// ---- 15) GET SAVED PLANS
app.get("/api/my-plans", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.user; 
    const plans = await itineraries.find({ userId: new ObjectId(userId) }).sort({ createdAt: -1 }).toArray();

    const formattedPlans = plans.map(p => {
      p.id = p._id;
      delete p._id;
      return p;
    });

    res.status(200).json({ plans: formattedPlans });
  } catch (e) {
    console.error("Get plans error", e);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});


// ---- Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 API on Port ${PORT}`);
});