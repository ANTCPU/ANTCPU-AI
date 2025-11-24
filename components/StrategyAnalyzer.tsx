import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { analyzeStrategy } from '../services/geminiService';
import { Platform, StrategyAnalysis } from '../types';

const StrategyAnalyzer: React.FC = () => {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<Platform>(Platform.TWITTER);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StrategyAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!content) return;
    setLoading(true);
    try {
      const data = await analyzeStrategy(content, platform);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreData = result ? [
    { name: 'Sentiment', value: result.sentimentScore, color: '#818cf8' }, // Indigo-400
    { name: 'Virality', value: result.viralProbability, color: '#34d399' }, // Emerald-400
  ] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white brand-font">Strategy Center</h2>
        <p className="text-zinc-400 mt-1">Optimize your copy with AI-driven insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-4">
           <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl backdrop-blur-sm">
             <label className="block text-sm font-medium text-zinc-300 mb-2 pl-1">Platform</label>
             <select 
               value={platform}
               onChange={(e) => setPlatform(e.target.value as Platform)}
               className="w-full bg-zinc-950 border border-zinc-700/50 rounded-xl p-3 text-white mb-6 focus:ring-2 focus:ring-indigo-500/50 outline-none"
             >
               {Object.values(Platform).map(p => (
                 <option key={p} value={p}>{p}</option>
               ))}
             </select>
             
             <label className="block text-sm font-medium text-zinc-300 mb-2 pl-1">Draft Content</label>
             <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-48 bg-zinc-950 border border-zinc-700/50 rounded-2xl p-4 text-white resize-none focus:ring-2 focus:ring-indigo-500/50 outline-none text-base"
                placeholder="Paste your draft post here..."
             />
             
             <button 
               onClick={handleAnalyze}
               disabled={loading || !content}
               className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/20 active:scale-95"
             >
               {loading ? 'Analyzing...' : 'Analyze Impact'}
             </button>
           </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-3xl min-h-[400px] backdrop-blur-sm">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-600 opacity-60">
              <span className="text-6xl mb-4 grayscale opacity-50">📊</span>
              <p className="font-medium">Run an analysis to see metrics</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/50 shadow-inner">
                    <h4 className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-4">Performance Score</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scoreData} layout="vertical">
                          <XAxis type="number" domain={[0, 100]} hide />
                          <YAxis dataKey="name" type="category" width={70} tick={{fill: '#a1a1aa', fontSize: 11, fontWeight: 500}} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff', borderRadius: '8px'}} 
                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                          />
                          <Bar dataKey="value" barSize={16} radius={[0, 4, 4, 0]}>
                            {scoreData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/50 shadow-inner flex flex-col justify-center items-center text-center">
                    <h4 className="text-zinc-400 text-xs uppercase tracking-wider font-bold mb-2">Detected Tone</h4>
                    <p className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">{result.tone}</p>
                 </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span className="text-indigo-400">⚡</span> AI Suggestions
                </h3>
                <ul className="space-y-3">
                  {result.improvementTips.map((tip, i) => (
                    <li key={i} className="flex gap-4 text-zinc-300 text-sm bg-zinc-950/30 p-3 rounded-xl border border-zinc-800/30">
                      <span className="text-indigo-500 font-bold mt-0.5">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-4">Trending Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="px-3 py-1.5 bg-zinc-800/50 text-indigo-300 rounded-lg text-xs font-mono border border-zinc-700/50 hover:bg-indigo-900/20 hover:border-indigo-500/30 transition-colors cursor-default">
                      #{tag.replace('#', '')}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrategyAnalyzer;