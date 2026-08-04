import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ costUsd: 0 });
    }

    const doc = await db.collection('users').doc(userEmail).get();
    
    if (!doc.exists) {
      return NextResponse.json({ costUsd: 0 });
    }

    const data = doc.data();
    return NextResponse.json({ costUsd: data?.total_cost_usd || 0 });
  } catch (error: any) {
    console.error('Fetch user cost error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
