from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.exercise import ExerciseResponse

class WorkoutExerciseBase(BaseModel):
    exercise_id: int
    order: int
    target_sets: Optional[int] = None
    target_reps: Optional[str] = None
    target_weight: Optional[float] = None

class WorkoutExerciseCreate(WorkoutExerciseBase):
    pass

class WorkoutExerciseResponse(WorkoutExerciseBase):
    id: int
    workout_id: int
    exercise: ExerciseResponse

    class Config:
        from_attributes = True


class WorkoutBase(BaseModel):
    name: str

class WorkoutCreate(WorkoutBase):
    exercises: Optional[List[WorkoutExerciseCreate]] = []

class WorkoutResponse(WorkoutBase):
    id: int
    user_id: int
    created_at: datetime
    exercises: List[WorkoutExerciseResponse] = []

    class Config:
        from_attributes = True
