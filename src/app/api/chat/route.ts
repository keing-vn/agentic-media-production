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
    const { message, persona, sessionId = 'default', history = [] } = await req.json();

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
      Fields: movie_id (string), scene_id (string), genre (string), scene_title (string).
      
      Generate a JSON object representing simple equality query conditions to answer this question.
      Example: {"genre": "Sci-Fi Action"} or {"scene_id": "SCENE_001"}.
      Only return valid JSON, nothing else. If the question doesn't require a query or is too complex for simple equality, return an empty object {}.
    `;

    const queryResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: sqlPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const queryText = queryResponse.text?.trim() || '{}';

    let dataContext = '';

    // 2. Execute Firestore query if one was generated
    if (queryText !== '{}') {
      try {
        const queryParams = JSON.parse(queryText);
        const allowedKeys = ['movie_id', 'scene_id', 'genre', 'scene_title'];
        let collectionRef: FirebaseFirestore.Query = db.collection('movie_scenes');
        let hasValidQuery = false;
        
        for (const [key, value] of Object.entries(queryParams)) {
          if (allowedKeys.includes(key)) {
            collectionRef = collectionRef.where(key, '==', value);
            hasValidQuery = true;
          }
        }
        
        if (hasValidQuery) {
          // Limit to 5 results
          collectionRef = collectionRef.limit(5);
          
          const snapshot = await collectionRef.get();
          const dataset = snapshot.docs.map(doc => doc.data());
          
          dataContext = `Firestore Data Result: ${JSON.stringify(dataset)}`;
        } else {
          dataContext = 'No valid query conditions were provided by the AI.';
        }
      } catch (dbError: any) {
        dataContext = `Failed to query Firestore: ${dbError.message}`;
      }
    } else {
      dataContext = 'No direct database query was executed for this question.';
    }

    // 3. Synthesize final response using Gemini with Chat History
    const chatContents = history.map((msg: any) => ({
      role: msg.role === 'agent' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Inject system instructions into the last user message
    if (chatContents.length > 0) {
      const lastMsg = chatContents[chatContents.length - 1];
      if (lastMsg.role === 'user') {
        lastMsg.parts[0].text += `\n\n[SYSTEM CONTEXT]\nData from database: ${dataContext}\nYou are the "Agentic Media Production" AI. The user is a ${persona}. Respond in Vietnamese naturally, incorporating the data context if relevant.`;
      }
    }

    const finalResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: chatContents,
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

    // 4. Calculate Estimated Cost and update Firestore
    const queryTokens = queryResponse.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
    const finalTokens = finalResponse.usageMetadata || { promptTokenCount: 0, candidatesTokenCount: 0 };
    
    const totalInput = (queryTokens.promptTokenCount || 0) + (finalTokens.promptTokenCount || 0);
    const totalOutput = (queryTokens.candidatesTokenCount || 0) + (finalTokens.candidatesTokenCount || 0);
    
    // Pricing for gemini-2.5-flash: $0.075 per 1M input, $0.30 per 1M output
    const costUsd = (totalInput * 0.075 / 1000000) + (totalOutput * 0.30 / 1000000);

    // Save total cost to users collection
    if (userEmail !== 'anonymous') {
      try {
        const { FieldValue } = await import('firebase-admin/firestore');
        await db.collection('users').doc(userEmail).set({
          total_cost_usd: FieldValue.increment(costUsd)
        }, { merge: true });
      } catch (e) {
        console.error("Failed to update user cost", e);
      }
    }

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

