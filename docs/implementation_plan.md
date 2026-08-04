# Implementation Plan: Agentic Media Production 🎬

## Goal Description
The objective is to pivot the core database of the application from ClickHouse to Firebase Firestore, implement user authentication via Google OAuth (NextAuth), and build out the persistent "Chat History" and "My Library" features. The project has also been renamed from "Agentic Cinema" to "Agentic Media Production".

## Proposed Changes

### 1. Database Migration (ClickHouse -> Firebase)
- **[DELETE]** `src/lib/clickhouse.ts`: Remove all ClickHouse related configurations and logic.
- **[NEW]** `src/lib/firebase.ts`: Initialize the Firebase Admin SDK using Service Account credentials.
- **[NEW]** `src/scripts/seed-firestore.ts`: Create a new script to seed `movie_scenes` data into Firestore.

### 2. Authentication (NextAuth + Google)
- **[NEW]** `src/lib/auth.ts`: Configure NextAuth options with Google Provider.
- **[NEW]** `src/app/api/auth/[...nextauth]/route.ts`: Expose NextAuth API routes.
- **[MODIFY]** `src/components/SessionProviderWrapper.tsx`: Wrap the app in `SessionProvider` for client-side auth state.
- **[MODIFY]** `src/app/page.tsx`: Add "Sign in with Google" prompt if the user is unauthenticated.

### 3. Persistent Chat History
- **[NEW]** `src/app/api/chat/history/route.ts`: Endpoint to fetch previous chat sessions from the `chat_history` collection.
- **[MODIFY]** `src/app/api/chat/route.ts`: Save each new message (user prompt and agent response) into Firestore under the user's email.
- **[MODIFY]** `src/components/ChatInterface.tsx`: Load chat history on mount and implement auto-scrolling.

### 4. My Library Feature
- **[NEW]** `src/app/api/library/route.ts`: Handle saving (POST) and retrieving (GET) bookmarked scripts and insights.
- **[NEW]** `src/components/LibraryModal.tsx`: A modal UI to display all saved items in the user's library.
- **[MODIFY]** `src/components/ChatInterface.tsx`: Add a "Save to Library" button on AI responses.

### 5. Rename & Branding
- **[MODIFY]** `package.json`, `README.md`, `src/app/page.tsx`, `src/components/ChatInterface.tsx`: Update all references of "Agentic Cinema Clickhouse" to "Agentic Media Production".

## Verification Plan

### Automated Tests
- Check if `npm run dev` builds successfully without TypeScript errors.

### Manual Verification
- Test signing in with a Google Account.
- Verify that messages are persistent across browser refreshes.
- Test the "Bookmark/Save to Library" button.
- Verify that opening the Library Modal displays the correctly saved data from Firestore.
- Check the Git repository to ensure secrets are untracked.
