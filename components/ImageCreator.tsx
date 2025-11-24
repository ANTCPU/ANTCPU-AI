import React, { useState, useRef } from 'react';
import { AspectRatio, ContentType, GeneratedAsset } from '../types';
import { generateImageContent, editImageContent } from '../services/geminiService';

interface ImageCreatorProps {
  onAssetCreated: (asset: GeneratedAsset) => void;
}

const ImageCreator: React.FC<ImageCreatorProps> = ({ onAssetCreated }) => {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [prompt, setPrompt] = useState('');
  const [ratio, setRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
  const [hq, setHq] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setGeneratedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    if (mode === 'edit' && !sourceImage) return;

    setLoading(true);
    try {
      let imageData;
      if (mode === 'create') {
        imageData = await generateImageContent(prompt, ratio, hq);
      } else {
        imageData = await editImageContent(sourceImage!, prompt);
      }
      
      setGeneratedImage(imageData);
      
      const newAsset: GeneratedAsset = {
        id: Date.now().toString(),
        type: ContentType.IMAGE,
        url: imageData,
        prompt: prompt,
        createdAt: new Date(),
        meta: { ratio, hq, mode }
      };
      
      onAssetCreated(newAsset);
    } catch (e) {
      console.error(e);
      alert("Failed to generate/edit image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white brand-font tracking-tight">Image Studio</h2>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">Create or edit antcpu-branded visuals.</p>
        </div>
        <div className="flex bg-zinc-900 rounded-xl p-1.5 border border-zinc-800 self-start md:self-auto">
          <button
            onClick={() => { setMode('create'); setGeneratedImage(null); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'create' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create
          </button>
          <button
            onClick={() => { setMode('edit'); setGeneratedImage(null); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              mode === 'edit' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Edit (Nano Banana)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Controls */}
        <div className="space-y-6 bg-zinc-900/40 p-5 md:p-6 rounded-3xl border border-zinc-800/50 backdrop-blur-sm order-2 lg:order-1">
          
          {mode === 'edit' && (
            <div className="space-y-2">
               <label className="block text-sm font-medium text-zinc-300 pl-1">Source Image</label>
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="cursor-pointer border-2 border-dashed border-zinc-700/50 hover:border-indigo-500/50 hover:bg-zinc-800/30 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[120px] transition-all bg-zinc-950/50 active:scale-[0.99]"
               >
                 {sourceImage ? (
                   <img src={sourceImage} alt="Source" className="h-32 object-contain rounded-lg shadow-sm" />
                 ) : (
                   <div className="text-center text-zinc-500">
                     <svg className="w-8 h-8 mx-auto mb-2 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <span className="text-sm">Tap to upload image</span>
                   </div>
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
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2 pl-1">
              {mode === 'create' ? 'Prompt' : 'Edit Instructions'}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={mode === 'create' ? "A futuristic cityscape with neon blue accents..." : "e.g., 'Add a retro filter', 'Remove background'"}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white placeholder-zinc-600 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none h-32 md:h-40 resize-none transition-all text-base"
            />
          </div>

          {mode === 'create' && (
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2 pl-1">Aspect Ratio</label>
                <div className="relative">
                  <select
                    value={ratio}
                    onChange={(e) => setRatio(e.target.value as AspectRatio)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                  >
                    {Object.values(AspectRatio).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-zinc-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
               </div>
               <div>
                 <label className="block text-sm font-medium text-zinc-300 mb-2 pl-1">Model</label>
                 <button
                    onClick={() => setHq(!hq)}
                    className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-medium text-sm ${
                      hq 
                      ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300' 
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                 >
                   {hq ? 'Pro (High Res)' : 'Flash (Fast)'}
                 </button>
               </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt || (mode === 'edit' && !sourceImage)}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
              loading 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
                : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              mode === 'create' ? 'Generate Visual' : 'Apply Edits'
            )}
          </button>
        </div>

        {/* Preview */}
        <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800/50 flex items-center justify-center p-2 min-h-[300px] md:min-h-[400px] relative overflow-hidden group order-1 lg:order-2 backdrop-blur-sm">
          {generatedImage ? (
            <>
              <img 
                src={generatedImage} 
                alt="Generated content" 
                className="w-full h-full object-contain rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                <a href={generatedImage} download={`antcpu-${Date.now()}.png`} className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-colors shadow-lg">
                  Download
                </a>
                <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-500 transition-colors shadow-lg">
                  Share
                </button>
              </div>
            </>
          ) : (
            <div className="text-center text-zinc-600 px-6">
               <div className="w-20 h-20 bg-zinc-800/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800/50">
                   <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
               </div>
               <p className="font-medium text-sm md:text-base">
                  {mode === 'create' ? 'Your creation will appear here' : 'Edited image will appear here'}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCreator;