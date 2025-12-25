from sqlalchemy.orm import Session
from typing import List, Optional

from app.models import Activity
from app.schemas import ActivityCreate, ActivityUpdate
from app.config import TIER_SCORES


class ActivityService:
    @staticmethod
    def calculate_impact_score(tier: str, is_leadership: bool, hours_per_week: int) -> int:
        score = TIER_SCORES.get(tier, 0)
        if is_leadership:
            score += 2
        if hours_per_week > 10:
            score += 1
        return score

    @staticmethod
    def get_all(db: Session) -> List[Activity]:
        return db.query(Activity).all()

    @staticmethod
    def get_by_id(db: Session, activity_id: int) -> Optional[Activity]:
        return db.query(Activity).filter(Activity.id == activity_id).first()

    @staticmethod
    def create(db: Session, activity: ActivityCreate) -> Activity:
        impact_score = ActivityService.calculate_impact_score(
            activity.tier, activity.is_leadership, activity.hours_per_week
        )
        db_activity = Activity(**activity.model_dump(), impact_score=impact_score)
        db.add(db_activity)
        db.commit()
        db.refresh(db_activity)
        return db_activity

    @staticmethod
    def update(db: Session, db_activity: Activity, activity: ActivityUpdate) -> Activity:
        update_data = activity.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_activity, key, value)

        db_activity.impact_score = ActivityService.calculate_impact_score(
            db_activity.tier, db_activity.is_leadership, db_activity.hours_per_week
        )

        db.commit()
        db.refresh(db_activity)
        return db_activity

    @staticmethod
    def delete(db: Session, db_activity: Activity) -> None:
        db.delete(db_activity)
        db.commit()
