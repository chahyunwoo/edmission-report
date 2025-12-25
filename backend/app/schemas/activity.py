from pydantic import BaseModel, Field
from typing import Optional


class ActivityBase(BaseModel):
    name: str = Field(..., max_length=50)
    category: str
    tier: str
    description: str = Field(..., max_length=150)
    hours_per_week: int = Field(default=0, ge=0, le=40)
    is_leadership: bool = False


class ActivityCreate(ActivityBase):
    pass


class ActivityUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=50)
    category: Optional[str] = None
    tier: Optional[str] = None
    description: Optional[str] = Field(None, max_length=150)
    hours_per_week: Optional[int] = Field(None, ge=0, le=40)
    is_leadership: Optional[bool] = None


class ActivityResponse(ActivityBase):
    id: int
    impact_score: int

    class Config:
        from_attributes = True
