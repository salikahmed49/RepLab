# Phase 1: Exercise Library & Workout Builder

## Overview
Phase 1 focuses on building the foundational entities that users interact with: **Exercises** and **Workouts**. Without these, users cannot track their progress. This phase bridges the gap between the empty foundation of Phase 0 and the actual functionality of the core fitness loop.

## What Was Implemented

### 1. Database Schema (FastAPI & SQLAlchemy)
We introduced three new tables to the database:
- **`Exercise`:** A catalog of movements (e.g., Squat, Bench Press).
- **`Workout`:** A reusable template created by a user (e.g., "Push Day", "Leg Day").
- **`WorkoutExercise`:** A mapping table that joins a `Workout` to an `Exercise` while holding metadata like target sets, target reps, and order.

### 2. Database Seeding (`seed.py`)
- We wrote an asynchronous script that uses SQLAlchemy to push a list of standard, global exercises into the database.
- *Why:* We don't want users arriving at an empty app and having to manually type in "Bench Press" before they can build a workout.

### 3. Backend APIs (Routers)
- **`/exercises`:** Added a `GET` route to fetch the global exercise list and a `POST` route to let users create their own custom exercises.
- **`/workouts`:** Added full CRUD (Create, Read, Update, Delete) routes. When a user creates a workout, the API expects a nested payload containing both the workout name and the list of exercises they want in it.

### 4. Frontend Integration (Next.js & TanStack Query)
- **Dashboard Layout:** Built a standard sidebar navigation component to house the authenticated views (`/exercises`, `/workouts`).
- **TanStack Query (`useQuery`):** We wrapped the React app in a `QueryClientProvider`. We used `useQuery` to fetch exercises and workouts.
- **Why TanStack Query?** Instead of manually managing `isLoading`, `data`, and `error` states with `useEffect` (which is highly prone to race conditions and boilerplate), TanStack Query handles caching, background refetching, and state management automatically.

---

## Key Architectural Concepts Explained

### 1. Separation of `Exercise` vs `WorkoutExercise`
**Concept:** Why don't we just put "target sets" directly on the `Exercise` table? 
**Why:** An `Exercise` (like "Squat") is a universal concept. It doesn't belong to any one workout. If we put `target_sets = 3` on the Squat record, every single workout that uses Squats would be forced to do 3 sets. 
By creating a join table (`WorkoutExercise`), the *relationship* holds the configuration. This means "Squat" can be 5 sets in "Strength Day" and 3 sets in "Hypertrophy Day" without conflicting.

### 2. Global vs. Custom Data (`created_by` flag)
**Concept:** The `Exercise` table has a `created_by` column that is a Foreign Key to the `User` table, but it is `nullable` (allowed to be empty).
**Why:** This allows us to have a single table for both. If `created_by` is `null` and `is_custom` is `false`, it's a global exercise everyone can see (seeded by us). If a user creates a weird specific exercise, we set `created_by` to their User ID, and the API filters the list so only they can see it.

### 3. Eager Loading (SQLAlchemy `selectinload`)
**Concept:** When you query a `Workout`, it only fetches the data from the `workouts` table. But the frontend needs to display the exercises inside it.
**Why:** If we loop through the workout and query the exercises one by one, we create an "N+1 query problem" (making 100 trips to the database instead of 1). We use `options(selectinload(Workout.exercises))` in our API to tell SQLAlchemy to fetch the workout *and* all its nested exercises efficiently in just two queries behind the scenes.

## What's Next?
Now that users can create workout templates, Phase 2 will focus on the **Live Workout Engine**. This involves snapshotting these templates into an active "Session" and logging real sets, weights, and reps.
