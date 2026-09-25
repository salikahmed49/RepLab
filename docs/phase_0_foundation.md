# Phase 0: Foundation (Documentation & Architecture)

## Overview
This phase establishes the structural and technological foundation of RepLab. Getting the foundation right ensures that as the application scales in complexity (like adding the AI Progression Intelligence engine), the codebase remains maintainable, secure, and performant.

## The Technology Stack

### 1. Database: PostgreSQL (via Supabase)
- **What it is:** An open-source relational database. Supabase provides a managed, cloud-hosted version of it.
- **Why we chose it:** RepLab's data is highly relational. A `WorkoutSession` belongs to a `User`, contains many `WorkoutSet`s, which refer to `Exercise`s. Relational databases like PostgreSQL enforce data integrity (ensuring a set cannot exist for an exercise that was deleted) better than NoSQL databases. Supabase handles the hosting and provides connection pooling for free.
- **Alternatives considered:** 
  - *MongoDB (NoSQL):* Rejected because tracking historical workout data requires complex relational joins (e.g., getting the 1RM progression over time) which NoSQL struggles with.
  - *Local Docker Postgres:* Good for development, but eventually requires manual deployment. Supabase skips this infra chore.

### 2. Backend: FastAPI (Python) + SQLAlchemy (Async)
- **What it is:** FastAPI is a modern, fast web framework for building APIs with Python. SQLAlchemy is an Object Relational Mapper (ORM) that translates Python classes into SQL tables.
- **Why we chose it:** 
  - **Speed & Async:** FastAPI natively supports asynchronous programming (`async/await`), allowing it to handle many concurrent users logging workouts simultaneously without blocking.
  - **AI Ecosystem:** Python is the undisputed king of the AI ecosystem. Since RepLab's differentiator is an LLM-powered Progression Intelligence engine, keeping the backend in Python makes integrating Anthropic/OpenAI APIs seamless.
  - **Pydantic Validation:** FastAPI uses Pydantic for data validation out of the box, ensuring that a user can't submit a workout set with "abc" reps.
- **Alternatives considered:**
  - *Spring Boot (Java):* Too heavy for a solo portfolio project. It has a steeper learning curve for AI integration compared to Python.
  - *Node.js/Express:* Lacks the built-in data validation (Pydantic) and native AI libraries that Python provides.

### 3. Frontend: Next.js (App Router) + TypeScript + Tailwind CSS
- **What it is:** Next.js is a React framework that provides routing and server-side rendering. TypeScript adds static typing to JavaScript. Tailwind is a utility-first CSS framework.
- **Why we chose it:** It is the industry standard for modern web applications. The App Router provides intuitive file-based routing (`app/login/page.tsx`). TypeScript catches bugs before the code runs.
- **Alternatives considered:**
  - *Vanilla React (Vite):* Lacks built-in routing and SEO capabilities out of the box. Next.js provides a more complete framework.

---

## Concepts Applied in this Phase

### 1. Object Relational Mapping (ORM) and Migrations (Alembic)
Instead of writing raw SQL commands (`CREATE TABLE users ...`), we define our database tables as Python classes (`class User(Base):`). 
- **Concept:** Alembic reads these Python classes and automatically generates the SQL code needed to create or update the database schema. This is called a "Migration".
- **Why:** It version-controls the database schema. If a mistake is made, we can "rollback" to a previous migration, just like `git undo`.

### 2. Connection Pooling (Supavisor)
- **Concept:** When a backend connects to a database, opening a connection takes time and resources. A Connection Pooler acts as a middleman that keeps a "pool" of open connections ready to use. 
- **Why:** In serverless or async environments (like FastAPI), hundreds of connections might be opened at once. PostgreSQL normally crashes if it gets too many direct connections. The pooler safely queues and reuses them. It also solves IPv6 resolution issues on local networks.

### 3. JWT Authentication (JSON Web Tokens)
- **Concept:** Instead of storing a session cookie on a server (which requires server memory), JWT is a stateless authentication method. When a user logs in, the server generates a cryptographically signed token containing their User ID and an expiration date. 
- **Why:** The frontend stores this token and sends it in the `Authorization` header of every API request. The backend just verifies the signature using the `SECRET_KEY`. It's fast, secure, and scales infinitely because the server doesn't need to remember who is logged in.

### 4. Password Hashing (Bcrypt)
- **Concept:** We never store plain-text passwords in the database. We use a cryptographic algorithm (Bcrypt) to turn `password123` into a scrambled string like `$2b$12$xyz...`. 
- **Why:** If the database is ever hacked or leaked, the hackers cannot read the users' passwords. Bcrypt is intentionally slow, meaning it takes a massive amount of computing power to "guess" a password through brute force.

### 5. Axios Interceptors
- **Concept:** In the frontend, an interceptor is a piece of code that runs *before* every HTTP request is sent out.
- **Why:** Instead of manually attaching the JWT token to the headers of every single API call (fetch workouts, fetch exercises, save set, etc.), the interceptor automatically grabs the token from `localStorage` and attaches it. This keeps the frontend code DRY (Don't Repeat Yourself).

---

## What was implemented
1. **Database Schema:** Created the foundational `User` model.
2. **Migrations:** Configured Alembic for async operations and ran the initial migration to build the database on Supabase.
3. **Backend Auth:** Implemented `/auth/register` and `/auth/login` endpoints in FastAPI. Added JWT generation and Bcrypt password hashing.
4. **Frontend API Client:** Created an Axios instance (`lib/api.ts`) with an auth interceptor.
5. **Frontend Pages:** Built the Login and Registration UI forms using React Hook Form and Zod for client-side validation.
