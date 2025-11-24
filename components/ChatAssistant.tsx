import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Content } from "@google/genai";

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Features
  const [useSearch, setUseSearch] = useState(false);
  const [useMaps, setUseMaps] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [location, setLocation] = useState<{latitude: number, longitude: number} | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (useMaps && "geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, (err) => console.warn("Geolocation failed", err));
    }
  }, [useMaps]);

  // Exclusive toggles logic
  const toggleSearch = () => {
    setUseSearch(!useSearch);
    if (!useSearch) { setUseMaps(false); setUseThinking(false); }
  };
  const toggleMaps = () => {
    setUseMaps(!useMaps);
    if (!useMaps) { setUseSearch(false); setUseThinking(false); }
  };
  const toggleThinking = () => {
    setUseThinking(!useThinking);
    if (!useThinking) { setUseSearch(false); setUseMaps(false); }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history for the API
      const history: Content[] = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await sendChatMessage(
        userMsg.text, 
        history, 
        { useSearch, useMaps, useThinking, location }
      );

      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: response.text || "I couldn't generate a text response.", 
        timestamp: new Date(),
        groundingMetadata: response.groundingMetadata
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = { role: 'model', text: "Sorry, I encountered an error. Please try again.", timestamp: new Date() };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Fixed height calculation to ensure it fits mobile screens without double scrolling
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)] flex flex-col bg-zinc-900/50 backdrop-blur-sm rounded-3xl border border-zinc-800/50 overflow-hidden shadow-2xl">
      {/* Header & Toolbar */}
      <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/80 flex flex-col md:flex-row justify-between items-center gap-3">
        <div>
           <h2 className="text-lg font-bold text-white brand-font flex items-center gap-2">
             <span className="text-indigo-400">✦</span> antcpu Intelligence
           </h2>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
           <button 
             onClick={toggleSearch}
             className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${useSearch ? 'bg-blue-500/10 border-blue-500/50 text-blue-300' : 'bg-zinc-950 border-zinc-700/50 text-zinc-400 hover:border-zinc-500'}`}
           >
             Google Search
           </button>
           <button 
             onClick={toggleMaps}
             className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${useMaps ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-zinc-950 border-zinc-700/50 text-zinc-400 hover:border-zinc-500'}`}
           >
             Google Maps
           </button>
           <button 
             onClick={toggleThinking}
             className={`px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${useThinking ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' : 'bg-zinc-950 border-zinc-700/50 text-zinc-400 hover:border-zinc-500'}`}
           >
             Deep Thinking
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 md:space-y-6 scroll-smooth">
        {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-60">
                <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">How can I assist you today?</p>
            </div>
        )}
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-zinc-800/80 text-zinc-200 rounded-bl-none border border-zinc-700/50'}`}>
                    <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
                    
                    {/* Grounding Display */}
                    {msg.groundingMetadata?.groundingChunks && (
                        <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-[10px] font-bold mb-2 opacity-70 uppercase tracking-wider">Sources</p>
                            <div className="flex flex-wrap gap-2">
                                {msg.groundingMetadata.groundingChunks.map((chunk: any, i: number) => {
                                    if (chunk.web?.uri) {
                                        return (
                                            <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[10px] bg-black/20 hover:bg-black/40 px-2 py-1.5 rounded transition-colors truncate max-w-[200px]">
                                                <span className="opacity-50">🔗</span>
                                                {chunk.web.title || chunk.web.uri}
                                            </a>
                                        );
                                    }
                                    if (chunk.maps?.placeAnswerSources?.reviewSnippets) {
                                        return <span key={i} className="text-[10px] text-zinc-400 italic bg-black/20 px-2 py-1 rounded">Maps Review</span>;
                                    }
                                    return null;
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        ))}
        {loading && (
             <div className="flex justify-start">
                <div className="bg-zinc-800/80 rounded-2xl rounded-bl-none p-4 flex gap-1.5 items-center border border-zinc-700/50">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-150"></span>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-zinc-950/80 border-t border-zinc-800/50 backdrop-blur-md">
         <div className="flex gap-2">
            <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask antcpu..."
                className="flex-1 bg-zinc-900 border border-zinc-700/50 rounded-xl px-4 py-3.5 text-white placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            />
            <button 
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3.5 rounded-xl transition-colors shadow-lg shadow-indigo-900/20"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            </button>
         </div>
         <p className="text-[10px] text-zinc-600 mt-2 text-center">AI responses may be inaccurate. Verify important info.</p>
      </div>
    </div>
  );
};

export default ChatAssistant;