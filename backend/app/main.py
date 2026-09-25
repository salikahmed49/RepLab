from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, exercises, workouts

app = FastAPI(title="RepLab API", version="1.0.0")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, this should be the Vercel frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(workouts.router)

@app.get("/")
async def root():
    return {"message": "Welcome to RepLab API"}
