from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.core.database import get_db
from app.models.workout import Workout, WorkoutExercise
from app.models.user import User
from app.schemas.workout import WorkoutCreate, WorkoutResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/workouts", tags=["workouts"])

@router.get("/", response_model=List[WorkoutResponse])
async def get_workouts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Workout).where(Workout.user_id == current_user.id).options(selectinload(Workout.exercises).selectinload(WorkoutExercise.exercise))
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=WorkoutResponse)
async def create_workout(
    workout_in: WorkoutCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    new_workout = Workout(name=workout_in.name, user_id=current_user.id)
    db.add(new_workout)
    await db.flush() # flush to get workout ID before adding exercises

    for ex in workout_in.exercises:
        new_workout_exercise = WorkoutExercise(
            workout_id=new_workout.id,
            exercise_id=ex.exercise_id,
            order=ex.order,
            target_sets=ex.target_sets,
            target_reps=ex.target_reps,
            target_weight=ex.target_weight
        )
        db.add(new_workout_exercise)
    
    await db.commit()
    await db.refresh(new_workout)
    
    # Reload with relationships
    query = select(Workout).where(Workout.id == new_workout.id).options(selectinload(Workout.exercises).selectinload(WorkoutExercise.exercise))
    result = await db.execute(query)
    return result.scalars().first()

@router.get("/{workout_id}", response_model=WorkoutResponse)
async def get_workout(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Workout).where(Workout.id == workout_id, Workout.user_id == current_user.id).options(selectinload(Workout.exercises).selectinload(WorkoutExercise.exercise))
    result = await db.execute(query)
    workout = result.scalars().first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    return workout

@router.delete("/{workout_id}")
async def delete_workout(
    workout_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    query = select(Workout).where(Workout.id == workout_id, Workout.user_id == current_user.id)
    result = await db.execute(query)
    workout = result.scalars().first()
    if not workout:
        raise HTTPException(status_code=404, detail="Workout not found")
    
    await db.delete(workout)
    await db.commit()
    return {"ok": True}
