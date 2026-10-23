"use client";
import AppShell from "@/components/layout/AppShell";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { getCurrentUser } from "@/lib/userAuth";
import { useAppStore } from "@/lib/store";
import { getTranslation } from "@/lib/translations";
import { Send, Mic, MicOff, Sparkles, Loader2, Bot, BrainCircuit, Globe, Volume2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  lang?: string;
}

export default function ChatPage() {
  const user = getCurrentUser();
  const { language, setLanguage } = useAppStore();
  const t = getTranslation(language);

  const initialWelcomeMessages: Record<string, string> = {
    en: `Hello ${user?.name || "Kisan Partner"}! 🙏 I am **KhetiSaathi AI Sahayak**, your intelligent agricultural and financial advisor.\n\nI can help you with live APMC mandi prices, fertilizer crisis solutions (Nano Urea), weather advisories, PM-Kisan / Namo Shetkari schemes, and KCC loan benefits. How may I assist you today?`,
    hi: `नमस्ते ${user?.name || "किसान भाई"}! 🙏 मैं **खेतीसाथी एआई सहायक** हूँ, आपका स्मार्ट कृषि एवं वित्तीय सलाहकार।\n\nमैं आपको लाइव मंडी भाव, यूरिया संकट समाधान (नैनो यूरिया), मौसम पूर्वानुमान, पीएम-किसान सम्मान निधि एवं केसीसी ऋण संबंधित सभी जानकारियों में मदद कर सकता हूँ। आज मैं आपकी क्या सेवा कर सकता हूँ?`,
    mr: `नमस्कार ${user?.name || "शेतकरी बंधू"}! 🙏 मी **शेतीसाथी एआय सहाय्यक** आहे, तुमचा विश्वासू कृषी व आर्थिक सल्लागार.\n\nमी तुम्हाला थेट कृषी उत्पन्न बाजार समिती भाव (लासलगाव, पिंपळगाव, पुणे), युरिया खत टंचाईवर नॅनो तंत्रज्ञान, हवामान अंदाज, नमो शेतकरी महासन्मान व पीएम-किसान योजना, आणि शून्य टक्के व्याज पीक कर्जाबाबत मदत करू शकतो. आज तुम्हाला कशाबद्दल माहिती हवी आहे?`,
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      text: initialWelcomeMessages[language] || initialWelcomeMessages.en,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes if no interaction has taken place yet
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === "welcome-1") {
      setMessages([
        {
          id: "welcome-1",
          role: "assistant",
          text: initialWelcomeMessages[language] || initialWelcomeMessages.en,
          time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  }, [language]);

  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={i} className="block mb-1.5 last:mb-0">
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**") ? (
              <strong key={j} className="font-semibold text-emerald-700 dark:text-emerald-400">
                {p.slice(2, -2)}
              </strong>
            ) : (
              <span key={j}>{p}</span>
            )
          )}
        </span>
      );
    });
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msgText = text || input.trim();
    if (!msgText || loading) return;
    setInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: msgText,
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "khetisaathi-deepseek-r1",
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.text,
          })),
          farmerContext: {
            ...user,
            language: language,
          },
        }),
      });

      if (!res.ok) throw new Error("AI service unavailable");

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "क्षमा करा / Please try again.";
      const reasoning = data.choices?.[0]?.message?.reasoning_content || "";
      const aiText = reasoning ? `<think>${reasoning}</think>\n\n${content}` : content;

      const aiMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: aiText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsgs: Record<string, string> = {
        mr: "🙏 AI सेवेशी तात्पुरता संपर्क होऊ शकला नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा किंवा थेट बाजारभाव पानावर माहिती तपासा.",
        hi: "🙏 AI सेवा से अस्थायी संपर्क बाधित हुआ है। कृपया कुछ पलों बाद पुनः प्रयास करें या मंडी भाव पेज देखें।",
        en: "🙏 Temporary connection issue with the AI engine. Please try again in a moment or visit Market Prices.",
      };
      const fallback: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: fallbackMsgs[language] || fallbackMsgs.en,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallback]);
    }
    setLoading(false);
  };

  const toggleVoice = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    const SR = win.webkitSpeechRecognition || win.SpeechRecognition;
    if (!SR) {
      alert("Voice input is not supported in this browser. Please use Google Chrome or Edge.");
      return;
    }
    if (listening) {
      setListening(false);
      return;
    }
    setListening(true);
    const recognition = new SR();
    
    // Choose speech recognition language based on active language
    recognition.lang = language === "mr" ? "mr-IN" : language === "hi" ? "hi-IN" : "en-IN";
    recognition.interimResults = false;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-160px)] sm:h-[calc(100vh-130px)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-[var(--text-primary)]">{t.chat.assistantTitle}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {language.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                {t.chat.engineBadge}
              </p>
            </div>
          </div>

          {/* Quick Language Toggle */}
          <div className="flex items-center gap-1 bg-[var(--bg-muted)] p-1 rounded-xl border border-[var(--border)]">
            <Globe className="w-3.5 h-3.5 text-[var(--text-muted)] ml-1" />
            {(["en", "hi", "mr"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === lang
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {lang === "en" ? "EN" : lang === "hi" ? "हिन्दी" : "मराठी"}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[85%] sm:max-w-[75%]">
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                  {msg.role === "assistant" && msg.text.includes("<think>") && (
                    <details className="mb-3 border border-emerald-200/50 dark:border-emerald-900/50 rounded-lg overflow-hidden transition-all bg-[var(--bg-card)]">
                      <summary className="cursor-pointer text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 p-2.5 relative hover:bg-emerald-50 dark:hover:bg-emerald-900/20 select-none list-none [&::-webkit-details-marker]:hidden">
                        <BrainCircuit className="w-3.5 h-3.5" /> {t.chat.viewReasoning}
                      </summary>
                      <div className="p-3 text-xs text-[var(--text-secondary)] whitespace-pre-wrap border-t border-[var(--border)] leading-relaxed italic opacity-90 bg-[var(--bg-muted)] font-mono">
                        {msg.text.match(/<think>([\s\S]*?)<\/think>/)?.[1].trim()}
                      </div>
                    </details>
                  )}
                  <div className="text-sm leading-relaxed">
                    {msg.role === "user"
                      ? msg.text
                      : renderFormattedText(msg.text.replace(/<think>[\s\S]*?<\/think>/g, "").trim())}
                  </div>
                </div>
                <p className={`text-[10px] mt-1 px-2 text-[var(--text-muted)] ${msg.role === "user" ? "text-right" : ""}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="chat-bubble-ai flex items-center gap-2.5 py-3 px-4">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span className="text-xs font-medium text-[var(--text-secondary)]">{t.chat.thinking}</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Questions Chips */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-none">
          {t.chat.quickQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-medium whitespace-nowrap hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition flex items-center gap-1.5 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-emerald-600" /> {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border)]">
          <button
            onClick={toggleVoice}
            title={listening ? "Listening... click to stop" : "Speak your question"}
            className={`p-2.5 rounded-xl transition-all ${
              listening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-gray-200 dark:hover:bg-slate-700"
            }`}
          >
            {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t.chat.placeholder}
            className="flex-1 p-2.5 rounded-xl border border-[var(--border)] text-sm bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 text-[var(--text-primary)]"
            disabled={loading}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
