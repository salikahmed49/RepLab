from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from sqlalchemy import or_

from app.core.database import get_db
from app.models.exercise import Exercise
from app.models.user import User
from app.schemas.exercise import ExerciseCreate, ExerciseResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/exercises", tags=["exercises"])

@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    search: Optional[str] = None, 
    muscle_group: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Exercise).where(
        or_(Exercise.created_by == None, Exercise.is_custom == False) # Global/seeded
    )
    # Note: For custom exercises belonging to the user, we'd add an OR condition for user_id. 
    # For MVP, we'll return all global exercises.

    if search:
        query = query.where(Exercise.name.ilike(f"%{search}%"))
    if muscle_group:
        query = query.where(Exercise.muscle_group.ilike(f"%{muscle_group}%"))
    
    result = await db.execute(query)
    exercises = result.scalars().all()
    return exercises

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(exercise_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Exercise).where(Exercise.id == exercise_id))
    exercise = result.scalars().first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    return exercise

@router.post("/", response_model=ExerciseResponse)
async def create_custom_exercise(
    exercise_in: ExerciseCreate, 
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_exercise = Exercise(
        name=exercise_in.name,
        muscle_group=exercise_in.muscle_group,
        equipment=exercise_in.equipment,
        instructions=exercise_in.instructions,
        is_custom=True,
        created_by=current_user.id
    )
    db.add(new_exercise)
    await db.commit()
    await db.refresh(new_exercise)
    return new_exercise
