import React, { useState, useEffect, useRef } from 'react';
import { generateVeoVideo } from '../services/geminiService';

const VideoGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [apiKeyReady, setApiKeyReady] = useState(false);
  const [imageInput, setImageInput] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkKey = async () => {
      try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          setApiKeyReady(hasKey);
        } else {
            setApiKeyReady(true);
        }
      } catch (e) {
        console.error("Error checking API key status", e);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
      if(window.aistudio && window.aistudio.openSelectKey) {
          await window.aistudio.openSelectKey();
          setApiKeyReady(true);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setLoading(true);
    setVideoUrl(null);
    try {
      const url = await generateVeoVideo(prompt, imageInput || undefined);
      setVideoUrl(url);
    } catch (e) {
      console.error(e);
      alert("Video generation failed. Ensure your API key has access to Veo.");
    } finally {
      setLoading(false);
    }
  };

  if (!apiKeyReady) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8 px-4">
        <div className="relative">
             <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full"></div>
             <h2 className="text-4xl font-bold brand-font text-white relative">Veo Video Studio</h2>
        </div>
        <p className="text-zinc-400 max-w-md text-lg">
          Generate cinematic AI video. Requires a paid API key with billing enabled.
        </p>
        <button 
            onClick={handleSelectKey}
            className="bg-white text-black font-bold py-4 px-10 rounded-full transition-transform active:scale-95 shadow-xl hover:bg-zinc-100"
        >
            Connect API Key
        </button>
        <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noreferrer"
            className="text-sm text-zinc-500 hover:text-indigo-400 underline transition-colors"
        >
            Learn about billing
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white brand-font flex items-center gap-3">
            Video Studio 
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded border border-indigo-500/30 font-sans font-medium">BETA</span>
        </h2>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">Generate 720p clips using Google's Veo model.</p>
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 space-y-6 backdrop-blur-sm">
        
        {/* Image Uploader */}
        <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3 pl-1">Starting Frame (Optional)</label>
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border border-zinc-700/50 bg-zinc-950/50 rounded-2xl p-4 flex items-center gap-4 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all active:scale-[0.99]"
            >
                {imageInput ? (
                    <>
                        <img src={imageInput} alt="Preview" className="w-20 h-20 object-cover rounded-xl shadow-lg" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white">Image Loaded</p>
                            <p className="text-xs text-zinc-500 mt-1">Click to replace</p>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setImageInput(null); }}
                            className="text-zinc-500 hover:text-red-400 p-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </>
                ) : (
                    <>
                        <div className="w-16 h-16 bg-zinc-800/50 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-zinc-300">Upload Reference Image</p>
                            <p className="text-xs text-zinc-500 mt-1">Veo will animate this frame</p>
                        </div>
                    </>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the video motion... (e.g. A cinematic drone shot zooming into the neon structure)"
                className="flex-1 bg-zinc-950/80 border border-zinc-700/50 rounded-2xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none h-32 md:h-auto resize-none"
            />
            <button
                onClick={handleGenerate}
                disabled={loading || !prompt}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-4 md:py-0 px-8 rounded-2xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95 flex items-center justify-center gap-2"
            >
                {loading ? 'Processing...' : 'Generate Video'}
            </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl h-[300px] md:h-[480px] flex items-center justify-center relative overflow-hidden shadow-2xl">
        {loading && (
            <div className="absolute inset-0 z-10 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="text-indigo-200 font-medium animate-pulse">Synthesizing Frames</p>
                <p className="text-zinc-600 text-xs mt-2 uppercase tracking-widest">Veo 3.1 Preview</p>
            </div>
        )}
        
        {videoUrl ? (
            <video 
                src={videoUrl} 
                controls 
                autoPlay 
                loop 
                className="w-full h-full object-contain"
            />
        ) : (
            <div className="text-center">
                <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-800/50">
                    <svg className="w-10 h-10 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                </div>
                <p className="text-zinc-500 font-medium">Video preview will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default VideoGenerator;