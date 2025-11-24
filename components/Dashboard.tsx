import React from 'react';
import { GeneratedAsset, ContentType } from '../types';

interface DashboardProps {
  assets: GeneratedAsset[];
  onChangeTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ assets, onChangeTab }) => {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome Hero */}
      <div className="bg-gradient-to-br from-indigo-900/80 via-zinc-900 to-zinc-950 border border-indigo-500/20 p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white brand-font mb-3 tracking-tight">Welcome back.</h2>
          <p className="text-indigo-200/80 max-w-xl text-sm md:text-base leading-relaxed">
            Your creative neural network is ready. Deploy new assets or analyze current performance.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <button 
              onClick={() => onChangeTab('create')}
              className="bg-white text-black font-bold px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 active:scale-95 transform duration-100"
            >
              + New Project
            </button>
            <button 
               onClick={() => onChangeTab('strategy')}
               className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-bold px-6 py-3 rounded-full hover:bg-indigo-500/20 transition-colors backdrop-blur-md active:scale-95 transform duration-100"
            >
              Analytics
            </button>
          </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute -right-20 -top-40 w-80 h-80 bg-indigo-600/30 rounded-full blur-[100px]"></div>
        <div className="absolute -left-20 bottom-0 w-60 h-60 bg-purple-600/10 rounded-full blur-[80px]"></div>
      </div>

      {/* Recent Assets */}
      <div>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2 brand-font">
          <span className="p-1.5 bg-zinc-800 rounded-lg">
             <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </span>
          Recent Output
        </h3>
        
        {assets.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed backdrop-blur-sm">
            <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
            <p className="text-zinc-500 font-medium">No assets generated yet.</p>
            <button onClick={() => onChangeTab('create')} className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-semibold">Start creating &rarr;</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {assets.slice().reverse().map((asset) => (
              <div key={asset.id} className="group relative aspect-square bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg hover:shadow-indigo-900/20 transition-all duration-300">
                {asset.type === ContentType.IMAGE && (
                  <img src={asset.url} alt={asset.prompt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
                {asset.type === ContentType.VIDEO && (
                    <video src={asset.url} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <span className="inline-block px-2 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded uppercase tracking-wider w-fit mb-2">{asset.type}</span>
                  <p className="text-white text-sm line-clamp-2 mb-2 font-medium leading-snug">{asset.prompt}</p>
                  <span className="text-[10px] text-zinc-400 font-mono">{new Date(asset.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;