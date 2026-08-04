import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { FieldValue } from 'firebase-admin/firestore';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await db.collection('user_library')
      .where('user_email', '==', userEmail)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();

    const items = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        type: data.type, // e.g. "Scene", "Script", "Setting"
        tags: data.tags || [],
        created_at: data.created_at?.toDate?.() || new Date()
      };
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Fetch library error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, type, tags } = body;

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const docRef = await db.collection('user_library').add({
      user_email: userEmail,
      content,
      type: type || 'Snippet',
      tags: tags || [],
      created_at: FieldValue.serverTimestamp()
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error('Save to library error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
