import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  ScrollShadow,
  Tooltip,
  Chip,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Sparkles, Trash2, Minimize2, X } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
  sources?: string[];
  timestamp?: Date;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "System Online. Ask me about Physical AI, ROS 2, or Isaac Sim.", timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID on mount
  useEffect(() => {
    const storedSessionId = typeof window !== 'undefined' ? localStorage.getItem('chatSessionId') : null;
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      if (typeof window !== 'undefined') {
        localStorage.setItem('chatSessionId', newSessionId);
      }
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const userMessage = input;
    setMessages((prev) => [...prev, { role: "user", text: userMessage, timestamp: new Date() }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://physical-ai-textbook.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: userMessage,
          session_id: sessionId 
        }),
      });
      
      if (!response.ok) throw new Error("Server error");
      
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.answer, sources: data.sources, timestamp: new Date() },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Connection failed. Please ensure the backend server is running on http://127.0.0.1:8000", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChatHistory = () => {
    setMessages([
      { role: "bot", text: "System rebooted. Chat history cleared. Ready for new queries.", timestamp: new Date() },
    ]);
    
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionId(newSessionId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatSessionId', newSessionId);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-2 right-6 z-[9999] flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-4 origin-bottom-right"
          >
            <Card className="w-[360px] sm:w-[400px] h-[550px] border border-cyan-500/30 bg-gradient-to-br from-black/95 via-zinc-950/95 to-black/95 backdrop-blur-2xl shadow-[0_0_60px_-10px_rgba(0,229,255,0.3)] rounded-2xl overflow-hidden flex flex-col">
              
              {/* HEADER */}
              <CardHeader className="flex justify-between items-center border-b border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-purple-500/10 p-4 z-20 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 rounded-full"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative z-10 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full border-2 border-cyan-400/50 flex items-center justify-center shadow-lg">
                      <Bot className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-white tracking-wide">AI Assistant</span>
                    <div className="flex items-center gap-2">
                      <motion.span 
                        className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.8)]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <span className="text-xs text-cyan-400 font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Tooltip content="Clear History" placement="bottom">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      onClick={clearChatHistory}
                      className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10 min-w-9 w-9 h-9 transition-all duration-200 flex items-center justify-center p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Close" placement="bottom">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      onClick={() => setIsOpen(false)} 
                      className="text-zinc-400 hover:text-white hover:bg-white/10 min-w-9 w-9 h-9 transition-all duration-200 flex items-center justify-center p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Tooltip>
                </div>
              </CardHeader>

              {/* BODY: Chat Area */}
              <CardBody className="p-0 overflow-hidden bg-transparent flex-1">
                <ScrollShadow className="h-full p-4 space-y-4">
                  {messages.map((msg, idx) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex flex-col max-w-[85%]">
                        <div
                          className={`p-3 px-4 rounded-2xl text-sm leading-relaxed shadow-lg ${
                            msg.role === "user"
                              ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-br-sm"
                              : "bg-zinc-900/90 border border-zinc-800 text-zinc-100 rounded-bl-sm backdrop-blur-sm"
                          }`}
                        >
                          {msg.text}
                          
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                              <span className="text-xs text-zinc-400 w-full mb-1">Sources:</span>
                              {msg.sources.map((src, i) => (
                                <Chip 
                                  key={i} 
                                  size="sm" 
                                  variant="flat"
                                  className="bg-cyan-500/10 text-cyan-300 text-xs border border-cyan-500/20"
                                >
                                  {src.split("/").pop()?.replace(".md", "")}
                                </Chip>
                              ))}
                            </div>
                          )}
                        </div>
                        {msg.timestamp && (
                          <span className={`text-[10px] text-zinc-500 mt-1 px-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                            {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl rounded-bl-sm p-3 flex gap-2 items-center backdrop-blur-sm">
                        <motion.span 
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                        />
                        <motion.span 
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.span 
                          className="w-2 h-2 bg-cyan-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </ScrollShadow>
              </CardBody>

              {/* FOOTER: Input Area */}
              <CardFooter className="p-4 bg-zinc-950/50 border-t border-cyan-500/20 backdrop-blur-sm">
                <div className="flex w-full gap-2 items-center">
                  <Input
                    placeholder="Ask anything about Physical AI..."
                    value={input}
                    onValueChange={setInput}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    variant="bordered"
                    classNames={{ 
                      base: "flex-1",
                      mainWrapper: "h-11",
                      input: "text-sm text-white placeholder:text-zinc-500 bg-transparent focus:outline-none focus:ring-0 text-left px-4",
                      inputWrapper: "h-11 bg-zinc-900/50 border-zinc-700/50 hover:border-cyan-500/50 focus-within:!border-cyan-500 focus-within:!outline-none focus-within:!ring-0 group-data-[focus=true]:border-cyan-500 group-data-[focus=true]:!outline-none rounded-xl transition-colors duration-200" 
                    }}
                    isDisabled={isLoading}
                  />
                  <Tooltip content="Send Message" placement="top">
                    <Button 
                      isIconOnly 
                      onClick={sendMessage} 
                      isDisabled={isLoading || !input.trim()}
                      className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold min-w-11 w-11 h-11 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center p-0"
                    >
                      <Send className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </Button>
                  </Tooltip>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tooltip content="Open AI Assistant" placement="left">
        <motion.button
          whileHover={{ scale: 1.08 }} 
          whileTap={{ scale: 0.92 }}
          className={`w-14 h-14 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.4)] bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-2 border-cyan-400/50 text-white flex items-center justify-center transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
          onClick={() => setIsOpen(true)}
        >
          <Sparkles className="w-7 h-7" strokeWidth={2} />
        </motion.button>
      </Tooltip>
    </div>
  );
}