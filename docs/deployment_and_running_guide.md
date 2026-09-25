# Run & Deployment Guide

This guide covers exactly how to run the RepLab project on your local machine, how to back it up to GitHub, and how to deploy it to production using Render and Vercel.

---

## 1. How to Run Locally

You will need two terminal windows open simultaneously: one for the backend and one for the frontend.

### Terminal 1: Running the Backend (FastAPI)
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Activate your virtual environment:
   ```bash
   # On Windows:
   .venv\Scripts\activate
   # On Mac/Linux:
   source .venv/bin/activate
   ```
3. Start the FastAPI development server using Uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```
4. *Your backend is now running at `http://localhost:8000`. You can view the automatic API documentation at `http://localhost:8000/docs`.*

### Terminal 2: Running the Frontend (Next.js)
1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. *Your frontend is now running at `http://localhost:3000`. Open this link in your browser to view your app.*

---

## 2. Pushing to GitHub

Version control is critical before you start deploying.

1. Open a terminal in your root `RepLab` folder.
2. Initialize git and commit your files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Phase 0 Foundation"
   ```
3. Go to [GitHub.com](https://github.com/) and click the **New Repository** button. Name it `replab` and leave it Public or Private. Do **NOT** initialize it with a README or .gitignore (you already have those).
4. Copy the two commands under **"…or push an existing repository from the command line"**. They will look like this:
   ```bash
   git remote add origin https://github.com/YourUsername/replab.git
   git branch -M main
   git push -u origin main
   ```
5. Paste those into your terminal and hit enter. Your code is now safely backed up on GitHub!

---

## 3. Deploying the Backend to Render

Render is the recommended platform for deploying Python/FastAPI applications because of its free tier and native Python support.

1. Go to [Render.com](https://render.com/) and create an account.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `replab` repository.
4. **Configuration settings:**
   - **Name:** `replab-backend`
   - **Root Directory:** `backend` *(Crucial: This tells Render where your Python code lives!)*
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
5. **Environment Variables:** Scroll down to the Environment Variables section and add everything from your `backend/.env` file:
   - `DATABASE_URL` = `postgresql+asyncpg://postgres.dwvaxjvcbriyrvwxtsif...` (Your Supabase URL)
   - `SECRET_KEY` = `09d25e094faa6ca2556c818166b7a9563...`
   - `ALGORITHM` = `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES` = `30`
6. Click **Create Web Service**. Wait a few minutes for it to build. Once deployed, Render will give you a live URL (e.g., `https://replab-backend.onrender.com`).

---

## 4. Deploying the Frontend to Vercel

Vercel is the company that created Next.js, making it the best platform to host your frontend.

1. **Before deploying, update your frontend API URL:**
   - Go to your `frontend` folder and create a `.env.production` file.
   - Add this line, replacing the URL with the one Render gave you:
     `NEXT_PUBLIC_API_URL=https://replab-backend.onrender.com`
   - Run `git add .`, `git commit -m "Add production API url"`, and `git push` to send this change to GitHub.

2. Go to [Vercel.com](https://vercel.com/) and log in with your GitHub account.
3. Click **Add New...** -> **Project**.
4. Import your `replab` GitHub repository.
5. **Configuration settings:**
   - **Project Name:** `replab`
   - **Framework Preset:** `Next.js`
   - **Root Directory:** Edit this and select the `frontend` folder. *(Crucial: Vercel needs to know the Next.js app is inside a subfolder).*
6. Click **Deploy**. Vercel will automatically detect your build settings and deploy the site in about a minute.
7. Vercel will give you a live domain (e.g., `https://replab.vercel.app`). Your app is now live!

---

### Important Post-Deployment Step: Updating CORS
By default, the backend only allows requests from specific origins. In `backend/app/main.py`, you currently have:
`allow_origins=["*"]`
While this works, it is bad practice for production. After you get your Vercel URL, you should update your FastAPI backend to only allow your Vercel URL:
```python
allow_origins=[
    "http://localhost:3000",
    "https://replab.vercel.app" # Your actual Vercel URL
]
```
Commit and push this change to GitHub, and Render will automatically deploy the updated security settings!
