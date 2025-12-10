import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  ScrollShadow,
  Avatar,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
  sources?: string[];
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "System Online. Ask me about Physical AI, ROS 2, or Isaac Sim." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage }),
      });
      
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, sources: data.sources },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Uplink failed. Ensure Python backend is running." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 origin-bottom-right"
          >
            <Card className="w-[320px] sm:w-[350px] h-[500px] border border-cyan-500/30 bg-black/95 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(0,229,255,0.2)] rounded-3xl overflow-hidden flex flex-col">
              
              {/* HEADER */}
              <CardHeader className="flex justify-between items-center border-b border-white/10 bg-white/5 p-3 z-20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-8 h-8 flex items-center justify-center">
                    <div className="absolute inset-0 bg-neon-cyan blur-md opacity-60 animate-pulse rounded-full" />
                    <div className="relative z-10 w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-1 border-neon-cyan/50 flex items-center justify-center shadow-lg">
                      <Bot className="w-5 h-5 text-white" strokeWidth={2} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white tracking-widest uppercase">AI Core</span>
                    <div className="flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse"/>
                        <span className="text-[16px] text-neon-cyan font-mono tracking-widest">v1.4 ACTIVE</span>
                    </div>
                  </div>
                </div>

                <Button 
                  isIconOnly 
                  size="sm" 
                  variant="light" 
                  onClick={() => setIsOpen(false)} 
                  className="text-zinc-500 hover:text-white min-w-8 w-8 h-8"
                >
                  ✕
                </Button>
              </CardHeader>

              {/* BODY: Chat Area */}
              <CardBody className="p-0 overflow-hidden bg-zinc-900 opacity-100 flex-1">
                <ScrollShadow className="h-full p-3 space-y-3">
                  {messages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-2.5 px-3 rounded-xl text-sm leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-cyan-900/40 border border-cyan-500/30 text-cyan-50 rounded-br-none"
                            : "bg-zinc-900/80 border border-zinc-800 text-zinc-300 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                        
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                            {msg.sources.map((src, i) => (
                              <div key={i} className="flex items-center px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] text-zinc-500 font-mono">
                                {src.split("/").pop()?.replace(".md", "")}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl rounded-bl-none p-3 flex gap-1 items-center">
                        <span className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce" />
                        <span className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce delay-75" />
                        <span className="w-1 h-1 bg-neon-cyan rounded-full animate-bounce delay-150" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollShadow>
              </CardBody>

              {/* FOOTER: Input Area with FORCE FIXES */}
              <CardFooter className="p-3 bg-black border-t border-zinc-800">
                <div className="flex w-full gap-2 items-center">
                  <Input
                    placeholder="Input command..."
                    value={input}
                    onValueChange={setInput}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    variant="bordered"
                    classNames={{ 
                        base: "h-10",
                        mainWrapper: "h-10",
                        input: "text-sm text-white placeholder:text-zinc-600 !bg-transparent focus:!outline-none focus:!ring-0",
                        inputWrapper: "h-10 bg-zinc-900/50 border-zinc-800 !ring-0 !outline-none focus-within:!border-neon-cyan focus-within:!ring-0 rounded-lg group-data-[focus=true]:border-neon-cyan group-data-[focus=true]:!outline-none" 
                    }}
                    isDisabled={isLoading}
                  />
                  <Button 
                    isIconOnly 
                    onClick={sendMessage} 
                    isDisabled={isLoading || !input.trim()}
                    className="bg-neon-cyan font-bold min-w-10 w-10 h-10 rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.2)] flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed p-0"
                  >
                    <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className={`w-12 h-12 rounded-full shadow-[0_0_20px_rgba(0,240,255,0.3)] bg-black border border-neon-cyan text-neon-cyan flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-90 scale-0 opacity-0 hidden' : 'flex'}`}
        onClick={() => setIsOpen(true)}
      >
        <Sparkles className="w-6 h-6" strokeWidth={2} />
      </motion.button>
    </div>
  );
}
