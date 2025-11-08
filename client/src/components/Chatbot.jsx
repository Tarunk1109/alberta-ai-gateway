import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizonal } from "lucide-react";
const API = '[https://alberta-ai-server.onrender.com](https://alberta-ai-server.onrender.com)';

export default function Chatbot({ lang = "en" }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me about Alberta’s culture, education, trade, sports, or tourism." }
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || busy) return;
    const next = [...messages, { role: "user", content: input.trim() }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const { data } = await axios.post(`${API}/api/chat`, { messages: next, lang });
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Sorry, something went wrong. Try again." }]);
    } finally { setBusy(false); }
  };

  const onKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b">
        <h2 className="font-semibold">Ask Alberta</h2>
        <p className="text-xs opacity-70">Press “/” to focus message • answers powered by OpenAI</p>
      </div>

      <div ref={boxRef} className="flex-1 overflow-y-auto p-3 bg-gray-50 dark:bg-neutral-900 text-sm">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <span className={`px-3 py-2 rounded-2xl border max-w-[80%] leading-relaxed
              ${m.role === "user"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white dark:bg-neutral-950 border-gray-200 dark:border-neutral-800"}`}>
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 border-t flex gap-2">
        <textarea
          id="chat-input"
          value={input}
          onChange={e=>setInput(e.target.value)}
          onKeyDown={onKey}
          rows={2}
          className="flex-1 border rounded p-2 text-sm bg-white dark:bg-neutral-950"
          placeholder="e.g., What are Alberta’s top universities?"
        />
        <button
          onClick={send}
          disabled={busy}
          className={`px-3 py-2 rounded-lg border self-start inline-flex items-center gap-2
                      ${busy ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-neutral-800"}`}
          title="Send"
        >
          <SendHorizonal className="w-4 h-4" />
          {busy ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}
