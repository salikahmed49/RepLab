from pydantic import BaseModel
from typing import Optional

class ExerciseBase(BaseModel):
    name: str
    muscle_group: str
    equipment: Optional[str] = None
    instructions: Optional[str] = None

class ExerciseCreate(ExerciseBase):
    is_custom: bool = True

class ExerciseResponse(ExerciseBase):
    id: int
    is_custom: bool
    created_by: Optional[int] = None

    class Config:
        from_attributes = True
