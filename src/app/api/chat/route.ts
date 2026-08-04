import { NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || 'anonymous';
    
    // Allow frontend to pass a sessionId, or generate one
    const { message, persona, sessionId = 'default' } = await req.json();

    // Save User Message to History
    if (userEmail !== 'anonymous') {
      try {
        await db.collection('chat_history').add({
          user_email: userEmail,
          session_id: sessionId,
          role: 'user',
          content: message,
          created_at: new Date()
        });
      } catch (e) {
        console.error("Failed to save user history", e);
      }
    }

    // 1. Ask Gemini to generate a JSON object for querying Firestore based on user message
    const sqlPrompt = `
      You are an AI assistant for a movie database. The user is asking a question.
      User persona: ${persona}
      User message: "${message}"
      
      We have a Firestore collection named 'movie_scenes'.
      Fields: movie_id (string), scene_id (string), genre (string), scene_title (string), script_text (string).
      
      Generate a JSON object representing simple equality query conditions to answer this question.
      Example: {"genre": "Sci-Fi Action"} or {"scene_id": "SCENE_001"}.
      Only return valid JSON, nothing else. If the question doesn't require a query or is too complex for simple equality, return "NO_QUERY".
    `;

    const queryResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sqlPrompt,
    });
    
    const queryText = queryResponse.text?.replace(/```json|```/g, '').trim() || 'NO_QUERY';

    let dataContext = '';

    // 2. Execute Firestore query if one was generated
    if (queryText !== 'NO_QUERY') {
      try {
        const queryParams = JSON.parse(queryText);
        let collectionRef: FirebaseFirestore.Query = db.collection('movie_scenes');
        
        for (const [key, value] of Object.entries(queryParams)) {
          collectionRef = collectionRef.where(key, '==', value);
        }
        
        // Limit to 5 results
        collectionRef = collectionRef.limit(5);
        
        const snapshot = await collectionRef.get();
        const dataset = snapshot.docs.map(doc => doc.data());
        
        dataContext = `Firestore Data Result: ${JSON.stringify(dataset)}`;
      } catch (dbError: any) {
        dataContext = `Failed to query Firestore: ${dbError.message}`;
      }
    } else {
      dataContext = 'No direct database query was executed for this question.';
    }

    // 3. Synthesize final response using Gemini
    const finalPrompt = `
      You are the "Agentic Cinema" AI. 
      The user is talking to you in the persona of a: ${persona}.
      User message: "${message}"
      
      Here is the data context retrieved from our database:
      ${dataContext}
      
      Formulate a helpful, natural response in Vietnamese. Tailor your tone and vocabulary to the user's persona (e.g., if they are a filmmaker, talk about camera angles and lighting; if a crew member, talk about budget and logistics). 
      Make sure to incorporate the data context naturally.
    `;

    const finalResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
    });

    const finalReply = finalResponse.text || "No reply generated";

    // Save AI Response to History
    if (userEmail !== 'anonymous') {
      try {
        await db.collection('chat_history').add({
          user_email: userEmail,
          session_id: sessionId,
          role: 'agent',
          content: finalReply,
          created_at: new Date()
        });
      } catch (e) {
        console.error("Failed to save AI history", e);
      }
    }

    // 4. Calculate Estimated Cost
    const queryTokens = queryResponse.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
    const finalTokens = finalResponse.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
    
    const totalInput = (queryTokens.promptTokenCount || 0) + (finalTokens.promptTokenCount || 0);
    const totalOutput = (queryTokens.candidatesTokenCount || 0) + (finalTokens.candidatesTokenCount || 0);
    
    // Pricing for gemini-2.5-flash: $0.075 per 1M input, $0.30 per 1M output
    const costUsd = (totalInput * 0.075 / 1000000) + (totalOutput * 0.30 / 1000000);

    return NextResponse.json({ 
      reply: finalReply,
      usage: {
        inputTokens: totalInput,
        outputTokens: totalOutput,
        estimatedCostUsd: costUsd
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

