import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

const seedData = [
  {
    scene_id: 'SCENE_001',
    genre: 'Sci-Fi Action',
    scene_title: 'Neon Highway Chase',
    script_text: 'A futuristic cybernetic runner dodges drone lasers along a rain-slicked highway under neon billboards.',
    sentiment_score: 0.85,
    target_demographic: 'Gen Z / Millennials',
    estimated_budget_usd: 250000,
    created_at: new Date()
  },
  {
    scene_id: 'SCENE_002',
    genre: 'Cyberpunk Thriller',
    scene_title: 'Underground Hacker Lab',
    script_text: 'An AI engineer uncovers a rogue autonomous agent hidden inside the central city grid network.',
    sentiment_score: 0.92,
    target_demographic: 'Tech Enthusiasts',
    estimated_budget_usd: 180000,
    created_at: new Date()
  }
];

async function seed() {
  console.log("Starting Firestore seed...");
  try {
    for (const data of seedData) {
      await db.collection('movie_scenes').add(data);
      console.log(`Added scene: ${data.scene_title}`);
    }
    console.log("Seed complete!");
  } catch (error) {
    console.error("Error seeding Firestore:", error);
  }
}

seed();
