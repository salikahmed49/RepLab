import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.exercise import Exercise
from app.models.user import User

seed_data = [
    {"name": "Barbell Bench Press", "muscle_group": "Chest", "equipment": "Barbell", "instructions": "Lie on bench, press bar upwards."},
    {"name": "Squat", "muscle_group": "Legs", "equipment": "Barbell", "instructions": "Stand with bar on upper back, squat down and up."},
    {"name": "Deadlift", "muscle_group": "Back", "equipment": "Barbell", "instructions": "Lift bar from floor to hip level."},
    {"name": "Overhead Press", "muscle_group": "Shoulders", "equipment": "Barbell", "instructions": "Press bar overhead from shoulders."},
    {"name": "Pull-up", "muscle_group": "Back", "equipment": "Bodyweight", "instructions": "Pull body up to a bar."},
]

async def seed():
    async with AsyncSessionLocal() as session:
        for ex in seed_data:
            exercise = Exercise(
                name=ex["name"],
                muscle_group=ex["muscle_group"],
                equipment=ex["equipment"],
                instructions=ex["instructions"],
                is_custom=False,
                created_by=None
            )
            session.add(exercise)
        await session.commit()
        print("Database seeded with default exercises!")

if __name__ == "__main__":
    asyncio.run(seed())
