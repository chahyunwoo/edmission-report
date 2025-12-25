from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.schemas import ActivityCreate, ActivityUpdate, ActivityResponse
from app.services import ActivityService

router = APIRouter(prefix="/activities", tags=["activities"])


@router.get("", response_model=List[ActivityResponse])
def get_activities(db: Session = Depends(get_db)):
    return ActivityService.get_all(db)


@router.get("/{activity_id}", response_model=ActivityResponse)
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = ActivityService.get_by_id(db, activity_id)
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return activity


@router.post("", response_model=ActivityResponse)
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    return ActivityService.create(db, activity)


@router.put("/{activity_id}", response_model=ActivityResponse)
def update_activity(
    activity_id: int, activity: ActivityUpdate, db: Session = Depends(get_db)
):
    db_activity = ActivityService.get_by_id(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    return ActivityService.update(db, db_activity, activity)


@router.delete("/{activity_id}")
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    db_activity = ActivityService.get_by_id(db, activity_id)
    if not db_activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    ActivityService.delete(db, db_activity)
    return {"message": "Activity deleted successfully"}
