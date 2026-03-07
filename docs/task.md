# Antigravity Japanese Grammar Flashcard - Tasks

## Phase 1: Core Flashcard Functionality (Completed)
- [x] Create `index.html` with flashcard 3D flip UI structure.
- [x] Create `style.css` for beautiful, modern styling (glassmorphism, animations).
- [x] Create `script.js` to handle flashcard flip logic and navigation.
- [x] Parse grammar content into a JavaScript object/array (`data.js`).
- [x] Implement Tinder-swipe logic (drag left/right) for learning progress.
- [x] Implement visual stamp feedback during swipe ("ĐÃ THUỘC", "CHƯA THUỘC").

## Phase 2: Interactive Quiz System (Completed)
- [x] Build Quiz UI with Question, Options, and Feedback sections.
- [x] Develop a JavaScript generator to pick random incorrect options from `data.js`.
- [x] Add filtering capability for quizzes by Week and Day.
- [x] Create a dedicated "Câu tiếp theo" button colored in dark green.

## Phase 3: Image Export Feature (Completed)
- [x] Integrate HTML2Canvas library.
- [x] Design a hidden DOM element (`export-template`) for exporting.
- [x] Refactor export card dimensions for TikTok (1440x1600 Portrait - 9:16).
- [x] Render Grammar title without gradient background, using bold natural red font.
- [x] Enlarge meaningful data (Meaning, Usage, Note, Examples) in the export bounding box.
- [x] Realign social links tightly under the translation blocks.

## Phase 4: User Authentication & Cloud Sync (Completed)
- [x] Integrate Firebase SDK.
- [x] Enable Firebase Authentication (Email/Password, Google, Facebook).
- [x] Enable Firebase Realtime Database for storing `my_progress` and profiles.
- [x] Implement logic to sync "Learned/Unlearned" swipe progress to the cloud.

## Phase 5: Admin Dashboard & Permissions (Completed)
- [x] Implement UI for Admins to view all registered users.
- [x] Display statistics per user: Login Count, Learned Words, Download Count, Active Status.
- [x] Add Request Download functionality (Pending -> Approved -> Revoked workflow).
- [x] Implement specific JS logic to allow real-time filtering by Status (All/Pending/Approved).
- [x] Implement specific JS logic to allow real-time sorting by Date/Logins/Downloads/Learned.
- [x] Secure `bulkDownloadBtn` (Download Whole Day) only for admins.

## Phase 6: PWA & Documentation (Completed)
- [x] Create `README.md` containing global architectural insights and setup steps.
- [x] Update the `/docs` folder with latest implementation and walkthrough reflections.
- [x] Setup `manifest.json` and `sw.js` for standalone app behavior.
