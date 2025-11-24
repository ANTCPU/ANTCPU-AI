import { GoogleGenAI, Type, Content } from "@google/genai";
import { AspectRatio, StrategyAnalysis } from "../types";

// Helper to get client - always creates new instance to ensure key freshness
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is missing from environment.");
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const generateImageContent = async (
  prompt: string,
  ratio: AspectRatio,
  hq: boolean
): Promise<string> => {
  const ai = getClient();
  // antcpu branding prompt injection
  const enhancedPrompt = `Visual style: High-tech, futuristic, minimal, neon accents, 'antcpu' brand aesthetic. ${prompt}`;
  
  const model = hq ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: ratio,
          imageSize: hq ? "2K" : undefined // Only available on Pro
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

export const editImageContent = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image data found in response");
  } catch (error) {
    console.error("Image edit error:", error);
    throw error;
  }
};

export const analyzeStrategy = async (postContent: string, platform: string): Promise<StrategyAnalysis> => {
  const ai = getClient();
  
  const prompt = `
    Analyze this social media post for ${platform} from the perspective of the 'antcpu' brand (tech-focused, innovative, futuristic).
    Post Content: "${postContent}"
    
    Provide a JSON response with:
    - sentimentScore (0-100)
    - viralProbability (0-100)
    - tone (string, e.g., "Professional", "Edgy")
    - hashtags (array of strings, optimized for the platform)
    - improvementTips (array of strings, specific actionable advice)
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentimentScore: { type: Type.INTEGER },
          viralProbability: { type: Type.INTEGER },
          tone: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          improvementTips: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          }
        },
        required: ["sentimentScore", "viralProbability", "tone", "hashtags", "improvementTips"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis generated");
  return JSON.parse(text) as StrategyAnalysis;
};

export const generateVeoVideo = async (
  prompt: string,
  imageInput?: string
): Promise<string> => {
  const ai = getClient();
  
  // Using the fast preview model for the demo
  const model = 'veo-3.1-fast-generate-preview';
  
  // Clean base64 if present
  const cleanImage = imageInput ? imageInput.replace(/^data:image\/(png|jpeg|jpg);base64,/, '') : undefined;

  let operation = await ai.models.generateVideos({
    model: model,
    prompt: `Cinematic, futuristic, antcpu style. ${prompt}`,
    image: cleanImage ? {
      imageBytes: cleanImage,
      mimeType: 'image/png'
    } : undefined,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9' // Enforcing 16:9 as default, could be 9:16 if needed
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!videoUri) throw new Error("Video generation failed or returned no URI");
  
  return `${videoUri}&key=${process.env.API_KEY}`;
};

interface ChatConfig {
  useSearch: boolean;
  useMaps: boolean;
  useThinking: boolean;
  location?: { latitude: number; longitude: number };
}

export const sendChatMessage = async (
  message: string,
  history: Content[],
  config: ChatConfig
) => {
  const ai = getClient();
  
  let model = 'gemini-3-pro-preview';
  const tools: any[] = [];
  let geminiConfig: any = {};

  // Feature specific model selection
  if (config.useSearch) {
    model = 'gemini-2.5-flash';
    tools.push({ googleSearch: {} });
  } else if (config.useMaps) {
    model = 'gemini-2.5-flash';
    tools.push({ googleMaps: {} });
    if (config.location) {
      geminiConfig.toolConfig = {
        retrievalConfig: {
          latLng: config.location
        }
      };
    }
  } else if (config.useThinking) {
    model = 'gemini-3-pro-preview';
    geminiConfig.thinkingConfig = { thinkingBudget: 32768 };
    // DO NOT set maxOutputTokens when using thinking
  }

  const chat = ai.chats.create({
    model: model,
    history: history,
    config: {
      tools: tools.length > 0 ? tools : undefined,
      ...geminiConfig
    }
  });

  const response = await chat.sendMessage({ message });
  return {
    text: response.text,
    groundingMetadata: response.candidates?.[0]?.groundingMetadata
  };
};