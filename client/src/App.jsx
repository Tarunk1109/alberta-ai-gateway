import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  Mic,
  StopCircle,
  Headphones,
  Users,
  Sparkles,
  Share2,
  MapPinned,
  Sun,
  Moon,
  X,
  MessageCircle,
  SendHorizonal,
  Droplet,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Mountain,
  Plane,
  Camera,
  BookOpen,
  CloudSun,
  MapPin,
  CalendarDays,
  Quote,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Globe,
  Users2,
  ArrowRight,
  Wifi,
  Wind,
  Shuffle,
  Feather,
  Package,
  Sparkle,
  Search,
  ListChecks,
  Palette,
  BookCopy,
  Gem,
  ImageDown,
  AudioLines,
  Languages,
  ClipboardCheck,
  // Added for Auth
  Lock,
  User,
  LogIn,
  LogOut,
  AtSign,
  // Added for My Plans
  BookMarked,
  Save,
} from "lucide-react";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";

// ---------- ENV-CONFIGURED CONSTANTS ----------
// ---
//
// THIS IS THE FIX. It now points to your local server.
// Remember to change this back to your Render URL when you deploy!
// ---
const API = "https://alberta-ai-server.onrender.com"; // <-- OLD (WRONG)
//const API = "http://localhost:5001"; // <-- NEW (CORRECT FOR LOCAL)

// Helper function for classnames
const cn = (...a) => a.filter(Boolean).join(" ");

// --- "WILD ROSE" LOGO ---
const WildRoseLogo = ({ className }) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 8L29 32H11L20 8Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-800 dark:text-gray-100"
    />
    <path
      d="M20 20C22.2091 20 24 18.2091 24 16C24 13.7909 22.2091 12 20 12C17.7909 12 16 13.7909 16 16C16 18.2091 17.7909 20 20 20Z"
      fill="rgb(var(--color-accent-rose))"
    />
    <path
      d="M20 20C20 26 25 28 25 32H15C15 28 20 26 20 20Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-800 dark:text-gray-100"
    />
  </svg>
);

// --- MOCKED DATA ---
// ---
// --- UPDATED AND EXPANDED SECTIONS DATA ---
// ---
// --- THIS IS WHERE YOU ADD YOUR .GLB AND POSTER PATHS ---
// ---
const SECTIONS = {
  plan: {
    title: "AI Trip Planner",
    icon: Sparkles,
  },
  xr: {
    title: "XR Explorer",
    icon: Camera,
  },
  culture: {
    title: "Culture",
    icon: BookOpen,
    description: "Discover Indigenous history, vibrant arts, and local festivals.",
    heroImage:
      "https://placehold.co/1200x600/fecaca/333333?text=Glenbow+Museum+Exhibit",
    bullets: [
      "Discover Indigenous history and cultural sites like Head-Smashed-In Buffalo Jump.",
      "Explore vibrant arts scenes, from the Art Gallery of Alberta to Calgary's street art.",
      "Experience world-famous events like the Calgary Stampede and Edmonton Folk Fest.",
      "Learn about Alberta's unique pioneer and ranching legacy at heritage parks.",
    ],
    links: [
      { label: "Royal Alberta Museum", href: "#" },
      { label: "Indigenous Tourism Alberta", href: "#" },
      { label: "Glenbow Museum", href: "#" },
      { label: "Calgary Stampede", href: "#" },
    ],
    keyFacts: [
      { value: "6", label: "UNESCO World Heritage Sites" },
      { value: "11,000+", label: "Years of Indigenous History" },
      { value: "75+", label: "Major Festivals Annually" },
    ],
    // --- YOUR PATHS FOR 'CULTURE' ---
    modelSrc: "/public/banff.glb",
    modelPoster: "/models/culture-poster.jpg",
  },
  trade: {
    title: "Trade",
    icon: Briefcase,
    description: "Connect with key industries: energy, tech, and agriculture.",
    heroImage:
      "https://placehold.co/1200x600/bfdbfe/333333?text=Calgary+Skyline+Trade",
    bullets: [
      "Connect with Alberta's key industries: energy, technology, and agriculture.",
      "Explore investment opportunities in emerging sectors like AI and clean tech.",
      "Learn about international trade agreements and Alberta's global logistics hubs.",
      "Access economic data, market reports, and business resources.",
    ],
    links: [
      { label: "Invest Alberta", href: "#" },
      { label: "Alberta's Economy", href: "#" },
      { label: "Tech in Alberta", href: "#" },
    ],
    keyFacts: [
      { value: "$100B+", label: "Annual Exports" },
      { value: "Top 3", label: "Global AI Research Hub" },
      { value: "$5.5B", label: "Agri-food Exports (2023)" },
    ],
    // --- YOUR PATHS FOR 'TRADE' ---
    modelSrc: "/public/bull.glb",
    modelPoster: "/models/trade-poster.jpg",
  },
  education: {
    title: "Education",
    icon: GraduationCap,
    description: "Explore top-tier universities and global research opportunities.",
    heroImage:
      "https://placehold.co/1200x600/d1fae5/333333?text=University+of+Alberta+Campus",
    bullets: [
      "Explore world-renowned programs at top-tier institutions like the University of Alberta and University of Calgary.",
      "Discover cutting-edge research in artificial intelligence, energy, and health sciences.",
      "Learn about study programs, scholarships, and international student opportunities.",
      "Connect with innovation hubs, polytechnics, and tech incubators driving the future.",
    ],
    links: [
      { label: "University of Alberta", href: "#" },
      { label: "University of Calgary", href: "#" },
      { label: "Study in Alberta", href: "#" },
      { label: "Amii (AI Research)", href: "#" },
    ],
    keyFacts: [
      { value: "250,000+", label: "Post-secondary Students" },
      { value: "Top 5", label: "Global AI Research Ranking (U of A)" },
      { value: "26", label: "Publicly Funded Institutions" },
    ],
    // --- YOUR PATHS FOR 'EDUCATION' ---
    modelSrc: "/public/falls.glb",
    modelPoster: "/models/education-poster.jpg",
  },
  sports: {
    title: "Sports",
    icon: HeartPulse,
    description: "From the NHL to world-class Rocky Mountain adventures.",
    heroImage: "https://placehold.co/1200x600/fef3c7/333333?text=Skiing+in+Banff",
    bullets: [
      "Experience the thrill of the 'Battle of Alberta' with NHL teams in Edmonton and Calgary.",
      "Discover world-class skiing, hiking, and biking in the Rocky Mountains.",
      "Explore hundreds of golf courses with stunning mountain and prairie backdrops.",
      "Attend major international sporting events, from rodeo to winter sports.",
    ],
    links: [
      { label: "Ski Banff (Big 3)", href: "#" },
      { label: "Edmonton Oilers", href: "#" },
      { label: "Calgary Flames", href: "#" },
      { label: "Spruce Meadows", href: "#" },
    ],
    keyFacts: [
      { value: "2", label: "NHL Teams" },
      { value: "1988", label: "Winter Olympics Host (Calgary)" },
      { value: "300+", label: "Golf Courses" },
    ],
    // --- YOUR PATHS FOR 'SPORTS' ---
    modelSrc: "/public/banff.glb",
    modelPoster: "/models/sports-poster.jpg",
  },
  tourism: {
    title: "Tourism",
    icon: Plane,
    description: "Plan your visit to iconic spots like Lake Louise and Jasper.",
    heroImage:
      "https://placehold.co/1200x600/e0e7ff/333333?text=Moraine+Lake+View",
    bullets: [
      "Plan your visit to iconic spots like Lake Louise, Moraine Lake, and Jasper National Park.",
      "Discover hidden gems, from the hoodoos of the Badlands to the dark skies of Wood Buffalo.",
      "Find information on national parks, accommodations, and unique local tours.",
      "Experience every adventure: scenic drives, wildlife viewing, and vibrant city life.",
    ],
    links: [
      { label: "Banff National Park", href: "#" },
      { label: "Jasper National Park", href: "#" },
      { label: "Travel Alberta", href: "#" },
      { label: "Royal Tyrrell Museum", href: "#" },
    ],
    keyFacts: [
      { value: "5", label: "National Parks" },
      { value: "600+", label: "Lakes and Rivers" },
      { value: "Largest", label: "Dark Sky Preserve (Wood Buffalo)" },
    ],
    // --- YOUR PATHS FOR 'TOURISM' ---
    modelSrc: "/public/city.glb",
    modelPoster: "/models/tourism-poster.jpg",
  },
};
// --- END OF UPDATED SECTIONS DATA ---

const NAV_LINKS = ["culture", "trade", "education", "sports", "tourism"];

const ALBERTA_SLIDER_IMAGES = [
  { src: "/public/spiritisland.jpg", alt: "Spirit Island" },
  { src: "/public/banfftown.jpg", alt: "Banff Town" },
  { src: "/public/morainelake.jpg", alt: "Moraine Lake" },
  { src: "/public/badlands.jpg", alt: "Alberta Badlands" },
  { src: "/public/skyline.jpg", alt: "Calgary Skyline" },
];

const GALLERY_IMAGES = [
  {
    src: "https://placehold.co/600x800/d1fae5/333333?text=Moraine+Lake",
    alt: "Moraine Lake",
    title: "Moraine Lake",
    description: "Iconic, glacially-fed lake in Banff National Park.",
  },
  {
    src: "https://placehold.co/600x600/fecaca/333333?text=Badlands",
    alt: "Alberta Badlands",
    title: "The Badlands",
    description: "Home to the Royal Tyrrell Museum of Palaeontology.",
  },
  {
    src: "https://placehold.co/600x400/bfdbfe/333333?text=Edmonton+Skyline",
    alt: "Edmonton Skyline",
    title: "Edmonton Skyline",
    description: "Alberta's capital, overlooking the River Valley.",
  },
  {
    src: "https://placehold.co/600x600/fef3c7/333333?text=Canola+Fields",
    alt: "Canola Fields",
    title: "Canola Fields",
    description: "Vast yellow fields blanketing the prairies in summer.",
  },
  {
    src: "https://placehold.co/600x800/e0e7ff/333333?text=Jasper+Dark+Sky",
    alt: "Jasper Dark Sky",
    title: "Jasper Dark Sky",
    description: "One of the world's largest accessible dark sky preserves.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The AI planner built an itinerary that felt like it was made just for me. I discovered hiking trails I never would have found on my own.",
    name: "Sarah K.",
    title: "Avid Hiker",
  },
  {
    quote:
      "I used the gateway to research tech partners in Calgary. The information on trade and education was incredibly concise and useful.",
    name: "David L.",
    title: "Investor",
  },
  {
    quote:
      "From the museums in Edmonton to the powwows, the cultural recommendations were spot on. A truly unforgettable family trip.",
    name: "Maria G.",
    title: "Cultural Explorer",
  },
];

const ALBERTA_STATS = [
  { value: 5, label: "National Parks", icon: Mountain, decimals: 0 },
  { value: 6, label: "UNESCO Sites", icon: Globe, decimals: 0 },
  { value: 333, label: "Days of Sun (Avg)", icon: Sun, decimals: 0 },
  { value: 4.8, label: "Million Population", icon: Users2, decimals: 1 },
];

// --- TTS AUDIO HELPERS ---
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes.buffer;
}

function pcmToWav(pcmData, sampleRate) {
  const numSamples = pcmData.length;
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataSize, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < numSamples; i++, offset += 2) {
    view.setInt16(offset, pcmData[i], true);
  }

  return new Blob([buffer], { type: "audio/wav" });
}

// --- Fetch image as base64 (for visual Q&A) ---
const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    let blob;
    if (!response.ok) {
      const fallback = await fetch(
        url.replace(/placehold\.co/g, "via.placeholder.com")
      );
      if (!fallback.ok) throw new Error("Image fetch failed");
      blob = await fallback.blob();
    } else {
      blob = await response.blob();
    }
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(reader.result.split(",")[1]); // strip prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Error fetching image as base64:", err);
    return null;
  }
};

// ========== UPDATED: AUTH MODAL COMPONENT (NOW HANDLES TOKEN) ==========

const AuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [mode, setMode] = useState("login"); // 'login' or 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset form when mode changes
  useEffect(() => {
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  }, [mode]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMode("login");
        setError("");
        setEmail("");
        setPassword("");
        setName("");
      }, 300); // Wait for animation
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (mode === "login") {
        response = await axios.post(`${API}/api/login`, {
          email,
          password,
        });
      } else {
        response = await axios.post(`${API}/api/signup`, {
          name,
          email,
          password,
        });
      }

      const { token, user } = response.data;

      // --- NEW: Save token to localStorage ---
      localStorage.setItem("token", token);

      onLoginSuccess(user); // Pass user data up to App
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <WildRoseLogo className="w-8 h-8" />
                  <span className="font-serif text-2xl font-medium text-gray-900 dark:text-white">
                    Alberta.AI
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full transition-colors text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toggler */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 mb-6">
                <button
                  onClick={() => setMode("login")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all",
                    mode === "login"
                      ? "bg-white dark:bg-gray-700 shadow text-accent-green"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode("signup")}
                  className={cn(
                    "flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all",
                    mode === "signup"
                      ? "bg-white dark:bg-gray-700 shadow text-accent-green"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div className="relative">
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                    >
                      Name
                    </label>
                    <User className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                )}

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >
                    Email
                  </label>
                  <AtSign className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                  >
                    Password
                  </label>
                  <Lock className="absolute left-3 top-9 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                {error && (
                  <p className="text-xs text-center text-accent-rose dark:text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-300 flex items-center justify-center",
                    "bg-accent-green hover:bg-accent-green/90",
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  )}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : mode === "login" ? (
                    "Login"
                  ) : (
                    "Create Account"
                  )}
                </button>

                <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                  {mode === "login"
                    ? "No account? "
                    : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="font-semibold text-accent-green hover:underline"
                  >
                    {mode === "login" ? "Sign Up" : "Login"}
                  </button>
                </p>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
// ========== END: AUTH MODAL COMPONENT ==========

// ========== UI COMPONENTS (Topbar, FullPanel, FabChat, Chatbot, etc.) ==========

const AnimatedCounter = ({ to, decimals = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      animate(0, to, {
        duration: 2,
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = value.toFixed(decimals);
          }
        },
      });
    }
  }, [isInView, to, decimals]);

  return <span ref={ref}>0</span>;
};

const motionProps = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.6, ease: "easeOut" },
  viewport: { once: true, amount: 0.2 },
});

// --- MODIFIED Topbar to accept user and auth props ---
const Topbar = ({
  dark,
  setDark,
  onOpenPanel,
  onOpenChat,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenMyPlans, // <-- NEW PROP
}) => (
  <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-20">
        <div className="flex items-center gap-3">
          <WildRoseLogo className="w-8 h-8" />
          <span className="font-serif text-2xl font-medium text-gray-900 dark:text-white">
            Alberta.AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((key) => (
            <button
              key={key}
              onClick={() => onOpenPanel(key)}
              className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              {SECTIONS[key].title}
            </button>
          ))}

          {/* --- NEW: "My Plans" Button --- */}
          {currentUser && (
            <button
              onClick={onOpenMyPlans}
              className="text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors hover:text-gray-900 dark:hover:text-white inline-flex items-center gap-1.5"
            >
              <BookMarked className="w-4 h-4" />
              My Plans
            </button>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark((d) => !d)}
            className="p-2.5 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={onOpenChat}
            className="hidden sm:inline-block px-4 py-2 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Chat
          </button>

          {/* --- AUTH BUTTONS --- */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-300">
                Hi, {currentUser.name.split(" ")[0]}
              </span>
              <button
                onClick={onLogout}
                className="p-2.5 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-full text-sm bg-accent-green text-white font-semibold transition-transform hover:scale-105 inline-flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
          )}
          {/* --- END AUTH BUTTONS --- */}
        </div>
      </div>
    </div>
  </header>
);

const FullPanel = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="fixed inset-0 z-50 p-4 md:p-8 lg:p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div className="relative h-full w-full rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 w-full flex-shrink-0">
              <h2 className="font-serif text-2xl font-medium text-gray-900 dark:text-white">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full transition-colors text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 w-full overflow-y-auto h-full">
              {children}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const FabChat = ({ open, setOpen, children }) => (
  <>
    <motion.button
      onClick={() => setOpen(true)}
      className="fixed z-40 bottom-6 right-6 rounded-full shadow-2xl bg-accent-green p-4 transition-transform hover:scale-110"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 150 }}
      title="Open Chat"
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          repeat: Infinity,
          duration: 2.2,
          ease: "easeInOut",
        }}
        className="relative"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </motion.div>
    </motion.button>

    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] rounded-l-3xl border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 150, damping: 22 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </>
);

const Chatbot = ({ lang = "en" }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Ask me about Alberta’s culture, education, trade, sports, or tourism.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    boxRef.current?.scrollTo({
      top: boxRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const { data } = await axios.post(`${API}/api/chat`, {
        messages: next,
        lang,
      });
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Try again.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="h-full flex flex-col rounded-l-3xl overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <h2 className="font-serif text-xl font-medium text-gray-900 dark:text-white">
          Ask Alberta
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Press “/” to focus • answers powered by AI
        </p>
      </div>

      <div
        ref={boxRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 text-sm"
      >
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span
              className={cn(
                "px-4 py-3 rounded-2xl max-w-[90%] leading-relaxed shadow-sm",
                m.role === "user"
                  ? "bg-accent-green text-white rounded-br-lg"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100 rounded-bl-lg"
              )}
            >
              {m.content}
            </span>
          </motion.div>
        ))}
        {busy && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="px-4 py-3 rounded-2xl rounded-bl-lg bg-gray-100 dark:bg-gray-800">
              <span
                className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <span
                className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce ml-1"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="inline-block w-2 h-2 rounded-full bg-gray-400 animate-bounce ml-1"
                style={{ animationDelay: "0.4s" }}
              />
            </span>
          </motion.div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            rows={1}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm bg-white dark:bg-gray-800 resize-none outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="What are Alberta’s top universities?"
            style={{ minHeight: "46px", maxHeight: "120px" }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          <button
            onClick={send}
            disabled={busy}
            className={cn(
              "px-4 py-3 rounded-xl inline-flex items-center justify-center bg-accent-green text-white transition-all duration-300",
              busy ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            )}
            title="Send"
          >
            <SendHorizonal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Skeleton = ({ lines = 3, className = "" }) => (
  <div className={cn("animate-pulse space-y-3", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-4 rounded bg-gray-200 dark:bg-gray-700"
        style={{
          width: i === lines - 1 ? "60%" : "100%",
          opacity: 1 - i * 0.1,
        }}
      />
    ))}
  </div>
);

const Toast = ({ show, type = "error", message, onClose, timeout = 3000 }) => {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => onClose?.(), timeout);
    return () => clearTimeout(t);
  }, [show, timeout, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <div
            className={cn(
              "px-5 py-3 rounded-full shadow-2xl text-sm border",
              type === "error"
                ? "bg-red-100 text-red-900 border-red-200 dark:bg-red-900/50 dark:text-red-100 dark:border-red-800"
                : "bg-green-100 text-green-900 border-green-200 dark:bg-green-900/50 dark:text-green-100 dark:border-green-800"
            )}
          >
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---
// --- NEW REDESIGNED SECTIONBODY COMPONENT ---
// ---
const SectionBody = ({ section }) => {
  const Icon = section.icon || Sparkle; // Fallback icon

  return (
    <div className="space-y-12">
      {/* 1. Hero Image */}
      <motion.div
        className="relative w-full h-64 md:h-80 rounded-3xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
      >
        <img
          src={section.heroImage}
          alt={section.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/1200x600/cccccc/333333?text=Image+Coming+Soon")
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
          <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm mb-3 w-max">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white shadow-lg">
            {section.title}
          </h2>
          <p className="text-lg text-white/90 mt-1 max-w-lg">
            {section.description}
          </p>
        </div>
      </motion.div>

      {/* 2. Key Facts */}
      {section.keyFacts && (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {section.keyFacts.map((fact) => (
            <div
              key={fact.label}
              className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/50 text-center"
            >
              <p className="text-4xl font-bold text-accent-green mb-1">
                {fact.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {fact.label}
              </p>
            </div>
          ))}
        </motion.div>
      )}

      {/* 3. Details (Bullets, Links, XR) */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h3 className="font-semibold text-2xl text-gray-900 dark:text-white mb-4">
            Key Highlights
          </h3>
          {section.bullets.map((b, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-base leading-relaxed text-gray-600 dark:text-gray-300"
            >
              <span className="text-accent-rose mt-1.5 flex-shrink-0">
                <ChevronRight className="w-4 h-4" />
              </span>
              <span>{b}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold mb-4 text-2xl text-gray-900 dark:text-white">
              Learn More
            </h3>
            <div className="flex flex-wrap gap-3">
              {section.links.map((l, i) => (
                <a
                  key={i}
                  className="text-sm px-4 py-2 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green transition-all hover:bg-accent-green/20 hover:shadow-md"
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold mb-4 text-2xl text-gray-900 dark:text-white">
              XR Peek
            </h3>
            {/*
              ---
              THIS IS THE FIX
              It now uses 'section.modelSrc' and 'section.modelPoster'
              which you defined in the SECTIONS object above.
              I've added fallbacks to '/banff.glb' just in case.
              ---
            */}
            <model-viewer
              src={section.modelSrc || "/banff.glb"}
              auto-rotate
              camera-controls
              poster={section.modelPoster || "/banff-placeholder.jpg"}
              style={{
                width: "100%",
                height: "260px",
                borderRadius: "16px",
                background: "transparent",
              }}
              className="shadow-inner"
            ></model-viewer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
// --- END OF NEW SECTIONBODY ---

// ---------- Image Slider ----------
const ImageSlider = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  const slideVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  const nextSlide = useCallback(
    () => setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1)),
    [images.length]
  );
  const prevSlide = () =>
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));

  useEffect(() => {
    if (!images.length) return;
    const timer = setInterval(nextSlide, 4000);
    return () => clearInterval(timer);
  }, [nextSlide, images.length]);

  if (!images.length) return null;

  return (
    <motion.div
      className="relative h-96 md:h-[500px] rounded-3xl shadow-2xl overflow-hidden bg-gray-200 dark:bg-gray-800"
      {...motionProps(0.4)}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={index}
          src={images[index].src}
          alt={images[index].alt}
          onError={(e) =>
            (e.target.src =
              "https://placehold.co/1000x800/333333/FFFFFF?text=Image+Not+Found")
          }
          className="absolute inset-0 w-full h-full object-cover"
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 text-gray-900 backdrop-blur-sm transition-all hover:bg-white/90"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 text-gray-900 backdrop-blur-sm transition-all hover:bg-white/90"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all",
              i === index ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
            )}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </motion.div>
  );
};

// ---------- Image Q&A Modal (uses GEMINI_KEY) ----------
// Modal to ask AI about a selected image (uses backend /api/chat)
const ImageQueryModal = ({ image, onClose }) => {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!image) return null;

  const handleAsk = async () => {
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const { data } = await axios.post(`${API}/api/chat`, {
        lang: "en",
        messages: [
          {
            role: "system",
            content:
              `You are an Alberta tourism expert. The user is viewing "${image.title}". ` +
              `Answer in 3–5 sentences. Be specific, friendly, and tie the answer to Alberta.`,
          },
          {
            role: "user",
            content: query.trim(),
          },
        ],
      });

      if (!data || !data.reply) {
        throw new Error("No reply from server");
      }

      setAnswer(data.reply);
    } catch (err) {
      console.error("Ask AI /api/chat error:", err);
      setError("Sorry, I couldn't get an answer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {image && (
        <>
          {/* Dark backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] p-4 md:p-8 lg:p-12 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
          >
            <div className="w-full max-w-4xl h-[520px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-2xl overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-gray-200/70 dark:border-gray-800/70">
                <div>
                  <h2 className="font-serif text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                    Ask AI about: {image.title}
                  </h2>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Powered by your Alberta AI Gateway assistant (OpenAI via /api/chat).
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2">
                {/* Left: Image */}
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full bg-black/55 text-[10px] text-white">
                    {image.alt}
                  </div>
                </div>

                {/* Right: Q&A */}
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ask about best season, type of experience, ideal visitors,
                    nearby spots, or how this connects Alberta to the world.
                  </p>

                  <div className="flex gap-2">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && !e.shiftKey && handleAsk()
                      }
                      placeholder="e.g., Why is this place special for international visitors?"
                      className="flex-1 text-sm px-3 py-2.5 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-accent-green/60"
                    />
                    <button
                      onClick={handleAsk}
                      disabled={loading || !query.trim()}
                      className="px-3 py-2.5 rounded-2xl bg-accent-green text-white text-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                      {loading ? "..." : <SendHorizonal className="w-4 h-4" />}
                    </button>
                  </div>

                  {error && (
                    <p className="text-xs text-red-500">
                      {error}
                    </p>
                  )}

                  {loading && !answer && (
                    <p className="text-xs text-gray-500">
                      Thinking about this Alberta view…
                    </p>
                  )}

                  {answer && (
                    <div className="mt-1 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-xs text-gray-800 dark:text-gray-100 leading-relaxed">
                      {answer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ---------- AI Creative Suite (uses callGeminiText & GEMINI_KEY) ----------
const CreativeCard = ({
  icon: Icon,
  title,
  description,
  color,
  onClick,
  loading,
}) => {
  const colorClasses =
    color === "rose"
      ? "text-accent-rose border-accent-rose/50 bg-accent-rose/10 hover:bg-accent-rose/20"
      : "text-accent-green border-accent-green/30 bg-accent-green/10 hover:bg-accent-green/20";

  return (
    <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center text-center">
      <div
        className={cn(
          "p-3 rounded-full mb-4",
          color === "rose" ? "bg-accent-rose/10" : "bg-accent-green/10"
        )}
      >
        <Icon
          className={cn(
            "w-6 h-6",
            color === "rose" ? "text-accent-rose" : "text-accent-green"
          )}
        />
      </div>
      <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
        {title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 flex-grow">
        {description}
      </p>
      <button
        onClick={onClick}
        disabled={loading}
        className={cn(
          "px-4 py-2 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-all duration-300",
          colorClasses,
          loading ? "opacity-50 cursor-not-allowed" : ""
        )}
      >
        <Shuffle className="w-4 h-4" />
        Generate
      </button>
    </div>
  );
};

// ---
// --- THIS IS THE FULLY CORRECTED, SECURE AI CREATIVE SUITE ---
// ---
const AICreativeSuite = ({ setErr, setOk }) => {
  const [activeTab, setActiveTab] = useState("muse");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState({ title: "", content: "", type: "" });

  const [criticInput, setCriticInput] = useState(
    "Day 1: Arrive in Calgary, go to the mall.\nDay 2: Drive to Banff, go to another mall.\nDay 3: Go home."
  );
  const [packerInput, setPackerInput] = useState(
    "5-day hiking trip to Jasper in July"
  );
  const [slangInput, setSlangInput] = useState(
    "I'm going to the mountains to ski."
  );
  const [postcardInput, setPostcardInput] = useState(
    "A moose wearing a hockey jersey in Banff"
  );
  const [audioInput, setAudioInput] = useState(
    "Head-Smashed-In Buffalo Jump"
  );
  const [localFinderInput, setLocalFinderInput] = useState({
    location: "Banff Avenue",
    interest: "a great coffee shop",
  });

  const [imageUrl, setImageUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    setOutput({ title: "", content: "", type: "" });
    setImageUrl("");
    setAudioUrl("");
    setErr("");
  }, [activeTab, setErr]);

  // --- FIX: This function now securely calls your backend ---
  const handleTextGeneration = async (
    systemPrompt,
    userQuery,
    title,
    type
  ) => {
    setLoading(true);
    setOutput({ title: "", content: "", type: "" });
    setImageUrl("");
    setAudioUrl("");
    setErr("");
    try {
      // Call the new backend endpoint
      const { data } = await axios.post(`${API}/api/gemini-text`, {
        systemPrompt,
        userQuery,
      });

      if (!data.text) {
        throw new Error("No text received from backend");
      }

      setOutput({ title, content: data.text, type });
      setOk("Content generated!");
    } catch (error) {
      console.error(error);
      setErr(error.response?.data?.error || "This creative feature failed.");
    } finally {
      setLoading(false);
    }
  };

  // Muse
  const fetchTheme = () => {
    const systemPrompt = `
      You are a creative travel agent. Generate a creative and unique theme for a 3-day trip in Alberta.
      The theme MUST be a short, catchy title formatted as a bolded line,
      like "**The Badlands Fossil Hunter:**" followed by one evocative sentence.
    `;
    handleTextGeneration(
      systemPrompt,
      "Generate a new, random Alberta trip theme.",
      "Your Next Adventure:",
      "theme"
    );
  };
  const fetchGem = () => {
    const systemPrompt = `
      You are an Alberta tourism expert. Tell a single surprising one-sentence "hidden gem" fact.
    `;
    handleTextGeneration(
      systemPrompt,
      "Give me a new hidden gem fact about Alberta.",
      "Did You Know?",
      "gem"
    );
  };
  const fetchStory = () => {
    const systemPrompt = `
      You are a creative storyteller. Write a 100-150 word flash fiction about a traveler in Alberta.
    `;
    handleTextGeneration(
      systemPrompt,
      "Tell me a new, random story about Alberta.",
      "A New Story:",
      "story"
    );
  };

  // Toolkit
  const runCritic = () => {
    const systemPrompt = `
      You are a witty Alberta travel guide. The user gives a boring itinerary.
      Critique it playfully and suggest 3-5 creative Alberta-based improvements (markdown bullets).
    `;
    handleTextGeneration(
      systemPrompt,
      criticInput,
      "Your Upgraded Plan:",
      "markdown"
    );
  };
  const runPacker = () => {
    const systemPrompt = `
      You are an expert Alberta travel planner.
      From the trip description, create a grouped packing list (markdown).
    `;
    handleTextGeneration(
      systemPrompt,
      packerInput,
      "Your Packing List:",
      "markdown"
    );
  };
  const runSlang = () => {
    const systemPrompt = `
      You are a friendly Alberta local. Turn the user's sentence into fun Alberta slang.
      One line only.
    `;
    handleTextGeneration(
      systemPrompt,
      slangInput,
      "Alberta Slang:",
      "slang"
    );
  };

  const runLocalFinder = () => {
    const systemPrompt = `
      You are an expert Alberta local guide.
      Recommend 3-5 places based on interest + location.
      Use markdown and include a Google Maps link as [View on Map](https://www.google.com/maps/search/?api=1&query=NAME+near+LOCATION).
    `;
    const userQuery = `Find: ${localFinderInput.interest}\nNear: ${localFinderInput.location}`;
    handleTextGeneration(
      systemPrompt,
      userQuery,
      "Your Local Recommendations:",
      "markdown"
    );
  };

  // --- FIX: This function now securely calls your backend ---
  const runPostcard = async () => {
    setLoading(true);
    setOutput({ title: "", content: "", type: "" });
    setImageUrl("");
    setAudioUrl("");
    setErr("");

    const userPrompt = `A digital painting of: ${postcardInput}. Stylized, vibrant, beautiful.`;

    try {
      // This endpoint is in your index.js, so this will work.
      const { data } = await axios.post(`${API}/api/gemini-image`, {
        prompt: userPrompt,
      });

      if (!data.base64Data) throw new Error("No image data");

      setImageUrl(`data:image/png;base64,${data.base64Data}`);
      setOutput({
        title: "Your AI Postcard:",
        content: postcardInput,
        type: "image",
      });
      setOk("Postcard generated!");
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || "Could not generate image.");
    } finally {
      setLoading(false);
    }
  };

  // --- FIX: This function now securely calls your backend ---
  const runAudioGuide = async () => {
    setLoading(true);
    setOutput({ title: "", content: "", type: "" });
    setImageUrl("");
    setAudioUrl("");
    setErr("");

    try {
      setOk("Writing audio guide script...");

      // Step 1: Generate the script using the text endpoint
      const systemPrompt = `
        You are an Alberta audio tour guide.
        Write a short, engaging, 60-second audio script (about 100-120 words)
        for the location: "${audioInput}".
        Speak directly to the listener. Be informative and evocative.
        DO NOT use any markdown, just plain text.
      `;
      const { data: textData } = await axios.post(`${API}/api/gemini-text`, {
        systemPrompt: systemPrompt,
        userQuery: audioInput,
      });

      const script = textData.text;
      if (!script) {
        throw new Error("Failed to generate audio script.");
      }

      setOk("Script written, generating audio...");

      // Step 2: Convert that script to audio using the TTS endpoint
      const { data: audioData } = await axios.post(`${API}/api/tts`, {
        text: script,
        voice: "shimmer", // A good voice for narration
      });

      if (!audioData.audioBase64) {
        throw new Error("Failed to generate audio file.");
      }

      setAudioUrl(audioData.audioBase64);
      setOutput({
        title: `Your Audio Guide: ${audioInput}`,
        content: script, // Show the script
        type: "audio-script",
      });
      setOk("Audio guide is ready!");
    } catch (e) {
      console.error(e);
      setErr(e.response?.data?.error || "Could not generate audio guide.");
    } finally {
      setLoading(false);
    }
  };

  const formattedOutput = useMemo(() => {
    if (!output.content) return null;
    const c = output.content;

    switch (output.type) {
      case "theme": {
        const parts = c.split("**");
        if (parts.length >= 3) {
          return {
            __html: `<strong class="text-xl">${parts[1]}</strong><p class="mt-2">${parts[2]}</p>`,
          };
        }
        return { __html: `<p>${c}</p>` };
      }
      case "story":
        return {
          __html: c
            .split("\n")
            .map((p) => `<p class="mb-2">${p}</p>`) // Added mb-2
            .join(""),
        };
      case "gem":
      case "slang":
        return {
          __html: `<p class="text-lg italic">"${c}"</p>`,
        };
      case "markdown": {
        let html = c
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">$1</li>') // Added mb-1
          .replace(
            /\[View on Map\]\((.*?)\)/g,
            '<a href="$1" target="_blank" rel="noreferrer" class="text-accent-green hover:underline">View on Map ↗</a>'
          );
        return { __html: html };
      }
      case "audio-script":
        return {
          __html: `<p class="text-sm italic text-gray-500 dark:text-gray-400">"${c}"</p>`,
        };
      case "image":
        return {
          __html: `<p class="text-sm text-gray-500 dark:text-gray-400">Your prompt: "${c}"</p>`,
        };
      default:
        return { __html: `<p>${c}</p>` };
    }
  }, [output]);

  return (
    <motion.section
      className="p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg"
      {...motionProps(0.3)}
    >
      <h3 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4 text-gray-900 dark:text-white">
        AI Creative Suite
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-center mb-10 max-w-2xl mx-auto">
        Inspire, visualize, and refine Alberta adventures with built-in AI
        tools.
      </p>

      <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
        <TabButton
          icon={Sparkle}
          label="Muse"
          isActive={activeTab === "muse"}
          onClick={() => setActiveTab("muse")}
        />
        <TabButton
          icon={Camera}
          label="Visualizer"
          isActive={activeTab === "visuals"}
          onClick={() => setActiveTab("visuals")}
        />
        <TabButton
          icon={ListChecks}
          label="Toolkit"
          isActive={activeTab === "tools"}
          onClick={() => setActiveTab("tools")}
        />
        <TabButton
          icon={MapPin}
          label="Finder"
          isActive={activeTab === "finder"}
          onClick={() => setActiveTab("finder")}
        />
      </div>

      <div className="min-h-[300px]">
        {/* Muse */}
        <AnimatePresence mode="wait">
          {activeTab === "muse" && (
            <motion.div
              key="muse"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <CreativeCard
                icon={Palette}
                title="Find a Theme"
                description="Generate a unique story angle for your trip."
                color="rose"
                onClick={fetchTheme}
                loading={loading}
              />
              <CreativeCard
                icon={Gem}
                title="Discover a Gem"
                description="Uncover a surprising Alberta fact."
                color="green"
                onClick={fetchGem}
                loading={loading}
              />
              <CreativeCard
                icon={BookCopy}
                title="Read a Story"
                description="Get a short immersive Alberta tale."
                color="rose"
                onClick={fetchStory}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visualizer */}
        <AnimatePresence mode="wait">
          {activeTab === "visuals" && (
            <motion.div
              key="visuals"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-green/10">
                    <ImageDown className="w-5 h-5 text-accent-green" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Postcard Generator
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Describe a scene. AI turns it into a digital postcard.
                </p>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                  value={postcardInput}
                  onChange={(e) => setPostcardInput(e.target.value)}
                />
                <button
                  onClick={runPostcard}
                  disabled={loading}
                  className="w-full mt-3 px-4 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-green border-accent-green/30 bg-accent-green/10 hover:bg-accent-green/20 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Image"}
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-green/10">
                    <AudioLines className="w-5 h-5 text-accent-green" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Audio Guide
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Enter a location. Get a narrated mini audio guide.
                </p>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                  value={audioInput}
                  onChange={(e) => setAudioInput(e.target.value)}
                />
                <button
                  onClick={runAudioGuide}
                  disabled={loading}
                  className="w-full mt-3 px-4 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-green border-accent-green/30 bg-accent-green/10 hover:bg-accent-green/20 disabled:opacity-50"
                >
                  {loading ? "Generating..." : "Generate Audio"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolkit */}
        <AnimatePresence mode="wait">
          {activeTab === "tools" && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-rose/10">
                    <Search className="w-5 h-5 text-accent-rose" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Itinerary Critic
                  </h4>
                </div>
                <textarea
                  className="w-full h-24 p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-xs bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-rose/50 text-gray-900 dark:text-white"
                  value={criticInput}
                  onChange={(e) => setCriticInput(e.target.value)}
                />
                <button
                  onClick={runCritic}
                  disabled={loading}
                  className="w-full mt-3 px-4 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-rose border-accent-rose/50 bg-accent-rose/10 hover:bg-accent-rose/20 disabled:opacity-50"
                >
                  Critique Plan
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-green/10">
                    <ListChecks className="w-5 h-5 text-accent-green" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Packing List
                  </h4>
                </div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                  value={packerInput}
                  onChange={(e) => setPackerInput(e.target.value)}
                />
                <button
                  onClick={runPacker}
                  disabled={loading}
                  className="w-full mt-3 px-4 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-green border-accent-green/30 bg-accent-green/10 hover:bg-accent-green/20 disabled:opacity-50"
                >
                  Generate List
                </button>
              </div>

              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-rose/10">
                    <Languages className="w-5 h-5 text-accent-rose" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Slang Translator
                  </h4>
                </div>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-rose/50 text-gray-900 dark:text-white"
                  value={slangInput}
                  onChange={(e) => setSlangInput(e.target.value)}
                />
                <button
                  onClick={runSlang}
                  disabled={loading}
                  className="w-full mt-3 px-4 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-rose border-accent-rose/50 bg-accent-rose/10 hover:bg-accent-rose/20 disabled:opacity-50"
                >
                  Translate
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Local Finder */}
        <AnimatePresence mode="wait">
          {activeTab === "finder" && (
            <motion.div
              key="finder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 lg:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-accent-green/10">
                    <MapPin className="w-5 h-5 text-accent-green" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    AI Local Finder
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Find hidden gems and local spots near any Alberta location.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Near Location
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                      value={localFinderInput.location}
                      onChange={(e) =>
                        setLocalFinderInput((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      I'm looking for...
                    </label>
                    <input
                      type="text"
                      className="w-full mt-1 p-3 border border-gray-300 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                      value={localFinderInput.interest}
                      onChange={(e) =>
                        setLocalFinderInput((prev) => ({
                          ...prev,
                          interest: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <button
                  onClick={runLocalFinder}
                  disabled={loading}
                  className="w-full md:w-auto mt-4 px-6 py-2 rounded-full border text-sm font-medium inline-flex justify-center gap-2 text-accent-green border-accent-green/30 bg-accent-green/10 hover:bg-accent-green/20 disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Find Places"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- FIX: LOADING ANIMATION --- */}
      {/* This logic is changed to show loading *before* content exists */}
      <AnimatePresence>
        {(loading || output.content || imageUrl || audioUrl) && (
          <motion.div
            className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center p-8 min-h-[150px]">
                <WildRoseLogo className="w-12 h-12 animate-spin text-accent-rose" />
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  Generating... Please wait.
                </p>
              </div>
            ) : (
              <>
                {formattedOutput && !imageUrl && !audioUrl && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {output.title}
                    </h4>
                    <div
                      className="text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed prose dark:prose-invert prose-sm"
                      dangerouslySetInnerHTML={formattedOutput}
                    />
                  </div>
                )}
                {imageUrl && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {output.title}
                    </h4>
                    <div dangerouslySetInnerHTML={formattedOutput} />
                    <img
                      src={imageUrl}
                      alt="Generated AI postcard"
                      className="rounded-lg shadow-md max-w-full h-auto mx-auto"
                    />
                  </div>
                )}
                {audioUrl && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {output.title}
                    </h4>
                    <div dangerouslySetInnerHTML={formattedOutput} />
                    <audio
                      controls
                      src={audioUrl}
                      className="w-full mt-4"
                    />
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex-1 md:flex-none md:px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-all duration-300 border",
      isActive
        ? "bg-accent-green text-white border-accent-green"
        : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
    )}
  >
    <Icon className="w-5 h-5" />
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

// ========== MAIN APP ==========

export default function App() {
  const [dark, setDark] = useState(false);
  const [consent, setConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [prompt, setPrompt] = useState(
    "Plan a 3-day Alberta culture & food trip."
  );
  const [sttText, setSttText] = useState("");
  const [plan, setPlan] = useState(null); // This is the *active* plan being viewed
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [lang, setLang] = useState("en");
  const [speechLang, setSpeechLang] = useState("en");

  const [openPanel, setOpenPanel] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  // --- AUTH STATE ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // --- NEW: "MY PLANS" STATE ---
  const [myPlans, setMyPlans] = useState([]);
  const [myPlansLoading, setMyPlansLoading] = useState(false);
  // --- END "MY PLANS" STATE ---

  const [liveWeather, setLiveWeather] = useState({
    loading: true,
    data: null,
  });
  const [liveTraffic] = useState({
    loading: false,
    data: {
      status: "Clear",
      details: "No delays reported near Canmore.",
      speed: "95 km/h",
    },
  });
  const [liveEvents, setLiveEvents] = useState({
    loading: true,
    data: [],
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const featuredEvent = liveEvents.data?.[0];

  // --- Check for existing login token on app load ---
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const { data } = await axios.get(`${API}/api/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setCurrentUser(data.user); // Log in
          setOk(`Welcome back, ${data.user.name.split(" ")[0]}!`);
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("token"); // Token is bad, remove it
        }
      }
      setAuthLoading(false); // Done checking
    };
    checkUser();
  }, []);

  // Weather - NOW SECURELY FETCHED FROM YOUR BACKEND
  useEffect(() => {
    const fetchWeather = async () => {
      setLiveWeather({ loading: true, data: null });
      try {
        // We now call YOUR backend, which safely uses the key
        const { data } = await axios.get(`${API}/api/weather`);
        setLiveWeather({
          loading: false,
          data: data, // The backend already formatted this for us
        });
      } catch (e) {
        console.error("Error fetching weather from backend:", e);
        // Fallback to mock data on error
        setLiveWeather({
          loading: false,
          data: { temp: 14, main: "Clear", wind: 5, humidity: 15 },
        });
      }
    };
    fetchWeather();
  }, []);

  // Events - NOW SECURELY FETCHED FROM YOUR BACKEND
  useEffect(() => {
    const fetchEvents = async () => {
      setLiveEvents({ loading: true, data: [] });
      try {
        // We now call YOUR backend, which safely uses the key
        const { data } = await axios.get(`${API}/api/events`);
        setLiveEvents({
          loading: false,
          data: data.events || [],
        });
      } catch (e) {
        console.error("Error fetching events from backend:", e);
        setLiveEvents({ loading: false, data: [] });
      }
    };
    fetchEvents();
  }, []);

  // model-viewer script
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  // smooth scroll
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey) return;
      if (e.key === "p" && !loading) {
        e.preventDefault();
        makePlan();
      }
      if (e.key === "/") {
        if (
          document.activeElement.tagName !== "INPUT" &&
          document.activeElement.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          setChatOpen(true);
          setTimeout(
            () => document.getElementById("chat-input")?.focus(),
            100
          );
        }
      }
      if (e.key === "Escape") {
        if (openPanel) setOpenPanel(null);
        if (chatOpen) setChatOpen(false);
        if (selectedImage) setSelectedImage(null);
        if (authModalOpen) setAuthModalOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loading, openPanel, chatOpen, selectedImage, authModalOpen]);

  const shareUrl = useMemo(() => {
    const u = new URL(window.location.href);
    u.searchParams.set("q", prompt);
    u.searchParams.set("lang", lang);
    return u.toString();
  }, [prompt, lang]);

  useEffect(() => {
    const u = new URL(window.location.href);
    const q = u.searchParams.get("q");
    const l = u.searchParams.get("lang");
    if (q) setPrompt(q);
    if (l) setLang(l);
  }, []);

  // --- AUTH FUNCTIONS ---
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    setOk(`Welcome, ${user.name.split(" ")[0]}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("token");
    setOk("You have been logged out.");
  };
  // --- END AUTH FUNCTIONS ---

  // --- NEW: SHARE PLAN HANDLER ---
  const handleSharePlan = () => {
    if (!plan) return;
    try {
      // Use fallback for iframe compatibility
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl; // shareUrl is already calculated
      textArea.style.position = "fixed";
      textArea.style.top = "-9999px";
      textArea.style.left = "-9999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      setOk("Share link copied to clipboard!");
    } catch (e) {
      console.error("Failed to copy share link:", e);
      setErr("Could not copy link.");
    }
  };
  // --- END SHARE PLAN HANDLER ---

  // --- NEW: MY PLANS FUNCTIONS ---
  const handleOpenMyPlans = async () => {
    setOpenPanel("my-plans");
    setMyPlansLoading(true);
    setErr("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to see plans.");
      }

      const { data } = await axios.get(`${API}/api/my-plans`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyPlans(data.plans || []);
    } catch (e) {
      console.error("Failed to fetch plans", e);
      setErr(e.response?.data?.error || "Could not fetch your plans.");
      setMyPlans([]);
    } finally {
      setMyPlansLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!plan || !currentUser) {
      setErr("No plan to save or not logged in.");
      return;
    }
    setOk("Saving...");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("You must be logged in to save a plan.");
      }

      await axios.post(
        `${API}/api/my-plans`,
        {
          plan: plan.plan, // Send the plan object (with title, prompt, days)
          weatherNote: plan.weatherNote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOk("Plan saved successfully!");
    } catch (e) {
      console.error("Failed to save plan", e);
      setErr(e.response?.data?.error || "Could not save your plan.");
    }
  };

  const handleSelectSavedPlan = (savedPlan) => {
    // Re-constitute the plan object as if it just came from /api/plan
    setPlan({
      plan: savedPlan.plan,
      weatherNote: savedPlan.weatherNote,
      checkedAtMST: new Date(savedPlan.createdAt).toLocaleString("en-CA", {
        timeZone: "America/Edmonton",
      }),
    });
    // --- FIX: Update prompt state so Share URL is correct ---
    setPrompt(savedPlan.plan.prompt || "");
    // Switch to the plan panel
    setOpenPanel("plan");
  };
  // --- END MY PLANS FUNCTIONS ---

  // --- OTHER FUNCTIONS ---

  const startRecording = async () => {
    if (!consent) {
      setErr("Please tick the mic consent checkbox first.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      mediaRecorderRef.current = rec;
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        try {
          setRecording(false);
          setOk("Transcribing with Whisper...");
          const formData = new FormData();
          formData.append("file", blob, "audio.webm");
          formData.append("speechLang", speechLang); // Send lang to our backend

          // Call OUR backend, not OpenAI's
          const { data } = await axios.post(`${API}/api/transcribe`, formData);

          setSttText(data.text || "");
          if (data.text) {
            setPrompt(data.text);
            setOk("Heard you! Ready to plan.");
          } else {
            setErr("Backend transcribed, but no text received.");
          }
        } catch (e) {
          console.error(e);
          setErr(e.response?.data?.error || "Speech transcription failed.");
        }
      };
      rec.start();
      setRecording(true);
      setOk("Listening...");
      setErr("");
    } catch {
      setErr("Mic permission denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const makePlan = async () => {
    if (loading || !prompt.trim()) return;
    setErr("");
    setOk("");
    setPlan(null); // Clear active plan
    setAudioUrl("");
    setLoading(true);
    try {
      if (demoMode) {
        const res = await fetch("/demo-plan.json");
        if (!res.ok) throw new Error("Demo file not found");
        const data = await res.json();
        setPlan(data);
        setOk("Loaded demo plan.");
        setOpenPanel("plan");
      } else {
        const { data } = await axios.post(`${API}/api/plan`, {
          prompt: prompt.trim(),
          lang,
          city: "Banff",
          dates: [],
        });
        setPlan(data); // data is { plan, weatherNote, checkedAtMST }
        setOk("Your plan is ready!");
        setOpenPanel("plan");
      }
    } catch (e) {
      console.error(e);
      setErr("Could not make a plan. Try Demo Mode or check server.");
    } finally {
      setLoading(false);
    }
  };

  const speakPlan = async () => {
    if (!plan?.plan?.days?.length) return;
    setOk("Generating audio...");
    setErr("");
    setAudioUrl("");
    const parts = [];
    (plan.plan.days || [])
      .slice(0, 5)
      .forEach((d, i) => {
        const stops = (d.stops || [])
          .slice(0, 3)
          .map((s) => s.name)
          .join(", ");
        parts.push(`Day ${i + 1}: ${d.title}. Highlights: ${stops}.`);
      });
    if (plan.weatherNote) parts.unshift(plan.weatherNote);
    const narration = parts.join(" ").replace(/\s+/g, " ").slice(0, 1200);
    try {
      const { data } = await axios.post(`${API}/api/tts`, { text: narration });
      setAudioUrl(data.audioBase64);
      setOk("Audio is ready to play.");
    } catch {
      setErr("TTS failed.");
    }
  };

  const joinGroup = async () => {
    setOk("Attempting to join group...");
    setErr("");
    try {
      const { data } = await axios.post(`${API}/api/group/join`, {
        destination: "Banff",
        date: "2025-11-15",
        user: currentUser?.email || "demo@user", // Use logged in user
      });
      setOk(`Joined group: ${data.group.members.length}/10`);
      setTimeout(
        () =>
          setOk(`Guide: ${data.guide.name} (verified)`),
        3100
      );
    } catch {
      setErr("Group join failed.");
    }
  };

  const mapUrl = (name) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      name + " Alberta"
    )}`;

  // Hero
  const Hero = (
    <section className="relative w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-24 md:py-32">
          <div className="text-center md:text-left">
            <motion.h1
              className="font-serif text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white"
              {...motionProps(0.2)}
            >
              Alberta<span className="text-accent-rose">.</span>
            </motion.h1>
            <motion.h2
              className="text-4xl md:text-6xl font-light tracking-tight text-gray-700 dark:text-gray-300 mt-2"
              {...motionProps(0.3)}
            >
              Your Story Awaits.
            </motion.h2>
            <motion.p
              className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg mx-auto md:mx-0"
              {...motionProps(0.4)}
            >
              A living AI gateway that connects visitors, students, and
              entrepreneurs worldwide to Alberta’s landscapes, culture, and
              opportunities.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-4"
              {...motionProps(0.5)}
            >
              <button
                onClick={() =>
                  document
                    .getElementById("planner-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-base font-semibold bg-accent-green text-white hover:bg-accent-green/90 hover:scale-105 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                Start Planning
              </button>
              <button
                onClick={() => setOpenPanel("culture")}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-accent-green hover:text-accent-green transition-all"
              >
                Learn Alberta
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          <ImageSlider images={ALBERTA_SLIDER_IMAGES} />
        </div>
      </div>
    </section>
  );

  // --- NEW: Show loading spinner while checking auth ---
  if (authLoading) {
    return (
      <div
        className={cn(
          "min-h-screen flex items-center justify-center",
          dark ? "dark bg-gray-950" : "bg-gray-50"
        )}
      >
        <WildRoseLogo className="w-16 h-16 animate-spin text-accent-rose" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen",
        dark ? "dark bg-gray-950 text-white" : "bg-gray-50 text-gray-900"
      )}
    >
      <style>{`
        :root {
          --color-accent-rose: 244 63 94;
          --color-accent-green: 22 101 52;
        }
        .dark {
          --color-accent-rose: 249 115 142;
          --color-accent-green: 34 197 94;
        }
        .text-accent-rose { color: rgb(var(--color-accent-rose)); }
        .bg-accent-rose { background-color: rgb(var(--color-accent-rose)); }
        .text-accent-green { color: rgb(var(--color-accent-green)); }
        .bg-accent-green { background-color: rgb(var(--color-accent-green)); }
        .bg-accent-rose\\/10 { background-color: rgba(var(--color-accent-rose),0.1); }
        .bg-accent-rose\\/20 { background-color: rgba(var(--color-accent-rose),0.2); }
        .border-accent-rose\\/50 { border-color: rgba(var(--color-accent-rose),0.5); }
        .bg-accent-green\\/10 { background-color: rgba(var(--color-accent-green),0.1); }
        .bg-accent-green\\/20 { background-color: rgba(var(--color-accent-green),0.2); }
        .border-accent-green\\/30 { border-color: rgba(var(--color-accent-green),0.3); }
        .font-serif { font-family: "Georgia","Times New Roman",serif; }
        .break-inside-avoid { break-inside: avoid; }
      `}</style>

      {/* --- PASSED NEW PROPS TO TOPBAR --- */}
      <Topbar
        dark={dark}
        setDark={setDark}
        onOpenPanel={setOpenPanel}
        onOpenChat={() => setChatOpen(true)}
        currentUser={currentUser}
        onOpenLogin={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenMyPlans={handleOpenMyPlans}
      />

      {Hero}

      {/* Planner */}
      <main
        id="planner-section"
        className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24"
      >
        <motion.section
          className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl"
          {...motionProps(0.1)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Voice */}
            <div className="flex flex-col items-center md:items-start md:border-r border-gray-200 dark:border-gray-700 pr-6 space-y-3">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                Speak Your Idea
              </h3>
              <div className="w-full">
                <label
                  htmlFor="speech-lang"
                  className="text-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  Language
                </label>
                <select
                  id="speech-lang"
                  value={speechLang}
                  onChange={(e) => setSpeechLang(e.target.value)}
                  disabled={recording}
                  className="w-full mt-1 border border-gray-300 dark:border-gray-700 rounded-xl p-2 text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese</option>
                  <option value="hi">Hindi</option>
                  <option value="translate">Translate to English</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                {!recording ? (
                  <button
                    onClick={startRecording}
                    disabled={!consent}
                    className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2.5 text-gray-600 dark:text-gray-300 hover:border-accent-green hover:text-accent-green disabled:opacity-50"
                  >
                    <Mic className="w-5 h-5" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 rounded-full border border-accent-rose bg-accent-rose/20 text-accent-rose inline-flex items-center gap-2.5 animate-pulse"
                  >
                    <StopCircle className="w-5 h-5" />
                    Stop
                  </button>
                )}
                <label className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="w-4 h-4 rounded text-accent-green bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                  />
                  Mic Consent
                </label>
              </div>
            </div>

            {/* Text */}
            <div className="md:col-span-2">
              <label
                htmlFor="prompt-input"
                className="font-semibold text-lg mb-3 block text-gray-900 dark:text-white"
              >
                Plan Your Journey
              </label>
              <div className="flex gap-2">
                <input
                  id="prompt-input"
                  type="text"
                  className="flex-1 w-full border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm bg-white dark:bg-gray-800 outline-none focus:ring-2 focus:ring-accent-green/50 text-gray-900 dark:text-white"
                  value={sttText || prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    setSttText("");
                  }}
                  placeholder="e.g., 5-day Rockies + Calgary food & culture"
                />
                <button
                  onClick={makePlan}
                  disabled={loading}
                  className={cn(
                    "px-4 py-3 rounded-xl inline-flex items-center justify-center bg-accent-green text-white font-semibold",
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105 transition-all"
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={demoMode}
                    onChange={(e) => setDemoMode(e.target.checked)}
                  />
                  Demo Mode (offline sample)
                </label>
                <button
                  onClick={() => navigator.clipboard.writeText(shareUrl)}
                  className="inline-flex items-center gap-1 hover:text-accent-green"
                >
                  <Share2 className="w-3 h-3" />
                  Copy sharable link
                </button>
              </div>
            </div>
          </div>
          {loading && (
            <div className="mt-6">
              <Skeleton lines={3} />
            </div>
          )}
        </motion.section>
      </main>

      {/* AI Creative Suite */}
      <section className="py-24 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AICreativeSuite setErr={setErr} setOk={setOk} />
        </div>
      </section>

      {/* Live Dashboard */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            {...motionProps(0.2)}
          >
            Live Alberta Dashboard
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
            {...motionProps(0.2)}
          >
            Weather, routes, and events that keep your itinerary grounded in
            reality.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Weather */}
            <motion.div
              className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-lg"
              {...motionProps(0.3)}
            >
              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white inline-flex items-center gap-2">
                <CloudSun className="w-6 h-6 text-accent-green" />
                Live Weather (Banff)
              </h3>
              {liveWeather.loading ? (
                <Skeleton lines={4} />
              ) : liveWeather.data ? (
                <>
                  <p className="text-5xl font-bold text-gray-900 dark:text-white">
                    {liveWeather.data.temp}°C
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {liveWeather.data.main}
                  </p>
                  <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>
                      <Wind className="w-4 h-4 inline" />{" "}
                      {liveWeather.data.wind} km/h
                    </span>
                    <span>
                      <Droplet className="w-4 h-4 inline" />{" "}
                      {liveWeather.data.humidity}%
                    </span>
                  </div>
                </>
              ) : (
                <p className="text-red-500">Could not load weather.</p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Source: Your Backend API
              </p>
            </motion.div>

            {/* Traffic (mock) */}
            <motion.div
              className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-lg"
              {...motionProps(0.4)}
            >
              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white inline-flex items-center gap-2">
                <Wifi className="w-6 h-6 text-accent-green" />
                Traffic (Trans-Canada)
              </h3>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {liveTraffic.data.status}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {liveTraffic.data.details}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                Avg. Speed: {liveTraffic.data.speed}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                Illustrative mock data for UX.
              </p>
            </motion.div>

            {/* Events */}
            <motion.div
              className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 shadow-lg flex flex-col"
              {...motionProps(0.5)}
            >
              <h3 className="font-semibold text-xl mb-4 text-gray-900 dark:text-white inline-flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-accent-green" />
                Featured Event
              </h3>
              {liveEvents.loading ? (
                <Skeleton lines={4} />
              ) : featuredEvent ? (
                <div className="flex-grow">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {featuredEvent.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {new Date(
                      featuredEvent.dates.start.localDate
                    ).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    <MapPin className="w-4 h-4 inline" />{" "}
                    {featuredEvent._embedded?.venues?.[0]?.name ||
                      "Venue TBD"}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 flex-grow">
                  No upcoming events found.
                </p>
              )}
              <button
                onClick={() => setOpenPanel("events")}
                className="mt-4 text-sm font-semibold text-accent-green inline-flex items-center gap-2 disabled:opacity-50"
                disabled={liveEvents.loading || !featuredEvent}
              >
                View More Events
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Source: Your Backend API
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Visual Journey & Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-center mb-12"
            {...motionProps(0.2)}
          >
            A Visual Journey
          </motion.h2>
          <motion.p
            className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12"
            {...motionProps(0.2)}
          >
            Click an image and let AI tell you more about what you’re seeing.
          </motion.p>
          <motion.div
            className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 mb-24"
            {...motionProps(0.3)}
          >
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                className="relative w-full h-auto rounded-2xl shadow-lg overflow-hidden break-inside-avoid group cursor-pointer"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  onError={(e) =>
                    (e.target.src = `https://placehold.co/600x${
                      i % 2 === 0 ? 800 : 600
                    }/333333/FFFFFF?text=Image+Not+Found`)
                  }
                  className="w-full h-auto object-cover"
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-4 bg-black/70 backdrop-blur-sm"
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h4 className="font-semibold text-white text-base">
                    {img.title}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {img.description}
                  </p>
                </motion.div>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-gray-900 text-sm font-semibold">
                    Ask AI
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-center mb-12"
            {...motionProps(0.2)}
          >
            Voices of Alberta
          </motion.h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                {...motionProps(0.3 + i * 0.1)}
              >
                <Quote className="w-10 h-10 text-accent-rose mb-4" />
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                  "{item.quote}"
                </p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900 dark:text-white"
            {...motionProps(0.2)}
          >
            Alberta by Numbers
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {ALBERTA_STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg flex flex-col items-center text-center"
                  {...motionProps(0.3 + i * 0.1)}
                >
                  <Icon className="w-10 h-10 text-accent-green mb-4" />
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter
                      to={stat.value}
                      decimals={stat.decimals}
                    />
                    {stat.decimals === 1 ? "" : "+"}
                  </span>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {stat.label}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Gateway
              </h4>
              <ul className="space-y-2 text-sm">
                <li>AI Planner</li>
                <li>XR Explorer</li>
                <li>AI Chat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Explore
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Culture</li>
                <li>Trade</li>
                <li>Education</li>
                <li>Tourism</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Resources
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Travel Alberta</li>
                <li>Invest Alberta</li>
                <li>Study in Alberta</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                Connect
              </h4>
              <ul className="space-y-2 text-sm">
                <li>Contact</li>
                <li>Privacy</li>
                <li>Terms</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              <WildRoseLogo className="w-8 h-8" />
              <span className="font-serif text-xl font-medium text-gray-900 dark:text-white">
                Alberta.AI
              </span>
            </div>
            {/* --- BUG FIX: Changed </g> to </p> --- */}
            <p className="mt-4 md:mt-0 text-sm">
              © {new Date().getFullYear()} Alberta AI Gateway. Built for
              Community Code Days.
            </p>
          </div>
        </div>
      </footer>

      {/* --- RENDER THE AUTH MODAL --- */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Panels */}
      <FullPanel
        open={openPanel === "plan"}
        onClose={() => setOpenPanel(null)}
        title={plan?.plan?.title || "Your Alberta Itinerary"}
      >
        {!plan ? (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <Sparkles className="w-16 h-16 text-accent-green/50 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Click “Make Plan” above to generate your trip.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Weather checked:{" "}
                <strong>{plan.checkedAtMST || "N/A"}</strong>
              </p>
              {/* --- NEW: SAVE PLAN BUTTON --- */}
              <div className="flex flex-wrap gap-2 pt-1">
                {currentUser && (
                  <button
                    onClick={handleSavePlan}
                    className="px-4 py-2 rounded-full border border-accent-green/30 bg-accent-green/10 text-accent-green inline-flex items-center gap-2.5 hover:bg-accent-green/20"
                  >
                    <Save className="w-4 h-4" /> Save Plan
                  </button>
                )}
                <button
                  onClick={speakPlan}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Headphones className="w-4 h-4" /> Listen to Summary
                </button>
                {/* --- NEW: SHARE PLAN BUTTON --- */}
                <button
                  onClick={handleSharePlan}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4" /> Share Plan
                </button>
                <button
                  onClick={joinGroup}
                  className="px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Users className="w-4 h-4" /> Join Group
                </button>
              </div>
              {audioUrl && (
                <audio
                  className="mt-2 w-full"
                  controls
                  src={audioUrl}
                  aria-label="Itinerary audio playback"
                />
              )}
              {plan.plan.days?.map((d, i) => (
                <motion.div
                  key={i}
                  className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <h3 className="font-semibold text-lg text-accent-green">
                    {d.title}
                  </h3>
                  <div className="mt-2 space-y-2">
                    {d.stops?.map((s, j) => (
                      <div
                        key={j}
                        className="text-sm flex items-start gap-2 text-gray-600 dark:text-gray-300"
                      >
                        <span className="text-accent-rose/70 mt-1">•</span>
                        <div>
                          <strong>{s.name}</strong>
                          <span className="opacity-70"> — {s.why}</span>{" "}
                          <a
                            className="underline text-accent-green/80 hover:text-accent-green"
                            href={mapUrl(s.name)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MapPinned className="inline w-3.5 h-3.5 -mt-0.5" />{" "}
                            Map
                          </a>
                          {s.source && (
                            <>
                              {" "}
                              ·{" "}
                              <a
                                className="underline text-accent-green/80 hover:text-accent-green"
                                href={s.source}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Source
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.section
              className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 sticky top-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">
                XR Preview: Banff
              </h2>
              <model-viewer
                src="/banff.glb"
                auto-rotate
                camera-controls
                poster="/banff-placeholder.jpg"
                style={{
                  width: "100%",
                  height: "420px",
                  borderRadius: "16px",
                  background: "transparent",
                }}
              ></model-viewer>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Rotate, zoom, and explore. On mobile, tap AR to drop Alberta
                into your room.
              </p>
            </motion.section>
          </div>
        )}
      </FullPanel>

      {/* --- NEW: "MY PLANS" PANEL --- */}
      <FullPanel
        open={openPanel === "my-plans"}
        onClose={() => setOpenPanel(null)}
        title="My Saved Plans"
      >
        {myPlansLoading ? (
          <Skeleton lines={10} />
        ) : myPlans.length > 0 ? (
          <div className="space-y-4">
            {myPlans.map((savedPlan) => (
              <button
                key={savedPlan.id}
                onClick={() => handleSelectSavedPlan(savedPlan)}
                className="w-full text-left block p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-accent-green"
              >
                <h3 className="font-semibold text-lg text-accent-green">
                  {savedPlan.plan.title || "My AI Plan"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {savedPlan.plan.prompt || "No prompt saved"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Saved on:{" "}
                  {new Date(savedPlan.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center h-full flex flex-col items-center justify-center">
            <BookMarked className="w-16 h-16 text-accent-green/50 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              You haven't saved any plans yet.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Go to the AI Planner, generate a trip, and click "Save Plan".
            </p>
          </div>
        )}
      </FullPanel>

      <FullPanel
        open={openPanel === "events"}
        onClose={() => setOpenPanel(null)}
        title="Upcoming Events in Alberta"
      >
        {liveEvents.loading && <Skeleton lines={10} />}
        {!liveEvents.loading && liveEvents.data.length > 0 ? (
          <div className="space-y-4">
            {liveEvents.data.map((event) => (
              <a
                key={event.id}
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="block p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-accent-green"
              >
                <h3 className="font-semibold text-lg text-accent-green">
                  {event.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {new Date(
                    event.dates.start.localDate
                  ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event._embedded?.venues?.[0]?.name || "Venue TBD"}
                </p>
              </a>
            ))}
          </div>
        ) : (
          !liveEvents.loading && (
            <p className="text-gray-500">No upcoming events found.</p>
          )
        )}
      </FullPanel>

      {NAV_LINKS.map((key) => (
        <FullPanel
          key={key}
          open={openPanel === key}
          onClose={() => setOpenPanel(null)}
          title={SECTIONS[key]?.title || key}
        >
          {/* This now renders the new, creative SectionBody */}
          <SectionBody section={SECTIONS[key]} />
        </FullPanel>
      ))}

      <ImageQueryModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
      />

      <FabChat open={chatOpen} setOpen={setChatOpen}>
        <Chatbot lang={lang} />
      </FabChat>

      <Toast
        show={!!err}
        type="error"
        message={err}
        onClose={() => setErr("")}
      />
      <Toast show={!!ok} type="ok" message={ok} onClose={() => setOk("")} />
    </div>
  );
}