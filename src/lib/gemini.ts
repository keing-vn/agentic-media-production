import { GoogleGenAI } from '@google/genai';

// Initialize the Google Gen AI SDK to use Vertex AI
// It automatically uses Application Default Credentials (ADC) when running locally
// if you have run `gcloud auth application-default login`.
export const ai = new GoogleGenAI({
  vertexai: {
    project: process.env.GOOGLE_CLOUD_PROJECT || 'cine-agent-ai',
    location: 'us-central1', // Ensure this matches your Vertex AI region
  }
});
