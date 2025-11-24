import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'create', label: 'Create Content', icon: 'M12 4v16m8-8H4' },
    { id: 'video', label: 'Video Studio (Veo)', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'strategy', label: 'Strategy & Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'assistant', label: 'AI Assistant', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  ];

  return (
    <aside className="w-64 bg-zinc-950/95 backdrop-blur-sm border-r border-zinc-800 hidden md:flex flex-col h-full fixed left-0 top-0 z-10 shadow-xl shadow-black/20">
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tighter text-white brand-font flex items-center gap-3">
          <div className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </div>
          antcpu
        </h1>
        <p className="text-[10px] text-zinc-500 mt-2 uppercase tracking-[0.2em] font-medium pl-1">CreatorOS</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/20 translate-x-1'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <svg className={`w-5 h-5 transition-colors ${activeTab === item.id ? 'text-white' : 'text-zinc-500 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
            </svg>
            <span className="font-medium text-sm tracking-wide">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
             <span className="text-xs text-zinc-300 font-mono font-medium">System Online</span>
          </div>
           <p className="text-[10px] text-zinc-600 leading-relaxed">
             Running on Gemini 1.5 Flash & 1.5 Pro<br/>
             Veo Video Engine Active
           </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;