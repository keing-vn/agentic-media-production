import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default';

    const snapshot = await db.collection('chat_history')
      .where('user_email', '==', userEmail)
      .where('session_id', '==', sessionId)
      .orderBy('created_at', 'asc')
      .limit(50)
      .get();

    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        role: data.role,
        content: data.content,
        created_at: data.created_at?.toDate?.() || new Date()
      };
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Fetch history error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
