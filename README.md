# Agentic Media Production 🎬

Agentic Media Production is an AI-powered assistant tailored for the film industry. It utilizes Google Cloud Agent Builder and Gemini models to provide intelligent, role-specific insights (e.g., Director, Producer, Cinematographer) to film crews.

This project is built with **Next.js**, **Google Gemini API**, and **Firebase/Firestore**.

## 🚀 Features

- **Persona-based Chat:** Ask questions and get answers tailored to different film crew roles.
- **Google Sign-in Integration:** Secure authentication via NextAuth using Google accounts.
- **Firebase Firestore Database:** Stores movie scenes, chat history, and saved items.
- **Dynamic AI Queries:** Gemini dynamically analyzes user prompts to query the Firestore database for relevant movie scenes and context before generating a final response.
- **Chat History:** Persistent chat history ensures you never lose a conversation after a refresh.
- **My Library:** A built-in modal to bookmark and save valuable AI-generated scripts, settings, and insights directly from the chat.
- **Estimated Cost Tracking:** Real-time token usage and cost estimation displayed in a UI widget.

## 🛠️ Tech Stack

- **Frontend:** Next.js 16 (App Router), React, CSS Modules (Glassmorphism design)
- **Authentication:** NextAuth (Google Provider)
- **Database:** Firebase Admin SDK (Firestore)
- **AI Model:** `@google/genai` (Gemini 2.5 Flash)

## ⚙️ Getting Started

### 1. Environment Variables

Create a `.env.local` file in the root directory and add the following keys:

```env
# Gemini Config
GEMINI_API_KEY=your_gemini_api_key

# NextAuth Config
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_secure_random_string

# Google OAuth Config
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Firebase Admin Config
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed Firestore Database

Run the provided script to seed sample movie scenes into your Firestore database:

```bash
npm run ts-node src/scripts/seed-firestore.ts
```
*(Make sure you have enabled the Firestore Database in your Firebase Console first)*

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Deployment

### Deploying to Vercel (Recommended)
1. Go to [Vercel](https://vercel.com/new).
2. Import your GitHub repository (`keing-vn/agentic-media-production`).
3. Add the following Environment Variables in the Vercel dashboard:
   - `NEXTAUTH_URL` (Set to your production domain, e.g., `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`
   - `GEMINI_API_KEY`
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY` (ensure `\n` is preserved)
4. Click **Deploy**.

### Deploying to Firebase App Hosting
Firebase App Hosting natively supports Next.js:
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Go to **App Hosting** and click **Get started**.
3. Connect your GitHub repository (`keing-vn/agentic-media-production`).
4. Set the root directory to `/` and select the `main` branch.
5. Create a new backend, link your environment variables via Cloud Secret Manager, and deploy!

## 📁 Key File Structure

- `src/app/page.tsx`: The main UI layout including the Chat, Library Modal, and Persona Selector.
- `src/app/api/chat/route.ts`: Core AI logic. Handles prompt generation, dynamic Firestore querying, and calculating token costs.
- `src/app/api/library/route.ts`: API to save and retrieve items from "My Library".
- `src/app/api/chat/history/route.ts`: API to retrieve previous chat sessions.
- `src/lib/firebase.ts`: Firebase Admin initialization.
- `src/scripts/seed-firestore.ts`: Migration and seeding script for setting up the database.
