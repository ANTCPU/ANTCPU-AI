// Enums must be standard enums, not const enums
export enum ContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  STRATEGY = 'STRATEGY',
  CHAT = 'CHAT'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  STANDARD = '4:3'
}

export enum Platform {
  INSTAGRAM = 'Instagram',
  TWITTER = 'X (Twitter)',
  LINKEDIN = 'LinkedIn',
  TIKTOK = 'TikTok',
  FACEBOOK = 'Facebook',
  THREADS = 'Threads'
}

export interface GeneratedAsset {
  id: string;
  type: ContentType;
  url: string;
  prompt: string;
  createdAt: Date;
  platform?: Platform;
  meta?: any;
}

export interface StrategyAnalysis {
  sentimentScore: number;
  hashtags: string[];
  improvementTips: string[];
  viralProbability: number; // 0-100
  tone: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  groundingMetadata?: any;
}

// Global window extension for Veo key selection
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  
  interface Window {
    aistudio?: AIStudio;
  }
}