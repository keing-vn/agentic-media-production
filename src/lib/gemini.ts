import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
