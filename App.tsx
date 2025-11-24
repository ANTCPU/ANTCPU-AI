import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ImageCreator from './components/ImageCreator';
import StrategyAnalyzer from './components/StrategyAnalyzer';
import VideoGenerator from './components/VideoGenerator';
import ChatAssistant from './components/ChatAssistant';
import Dashboard from './components/Dashboard';
import { GeneratedAsset } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);

  const handleAssetCreated = (asset: GeneratedAsset) => {
    setAssets(prev => [...prev, asset]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard assets={assets} onChangeTab={setActiveTab} />;
      case 'create':
        return <ImageCreator onAssetCreated={handleAssetCreated} />;
      case 'strategy':
        return <StrategyAnalyzer />;
      case 'assistant':
        return <ChatAssistant />;
      case 'video':
        return <VideoGenerator />;
      default:
        return <Dashboard assets={assets} onChangeTab={setActiveTab} />;
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /> },
    { id: 'create', label: 'Image', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /> },
    { id: 'video', label: 'Veo', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /> },
    { id: 'strategy', label: 'Strategy', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /> },
    { id: 'assistant', label: 'Chat', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-indigo-500/30 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content - Added pb-24 for mobile nav clearance */}
      <main className="md:ml-64 p-4 md:p-8 min-h-screen pb-28 md:pb-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
           {renderContent()}
        </div>
      </main>

      {/* Modern Glassmorphic Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-800/50 p-2 z-50 pb-safe">
        <div className="flex justify-around items-center">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 w-16 ${
                activeTab === item.id 
                  ? 'text-indigo-400 bg-indigo-500/10' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {item.icon}
              </svg>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;