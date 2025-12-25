from sqlalchemy import Column, Integer, String, Boolean, Text

from app.database import Base


class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    tier = Column(String(20), nullable=False)
    description = Column(Text, nullable=False)
    hours_per_week = Column(Integer, default=0)
    is_leadership = Column(Boolean, default=False)
    impact_score = Column(Integer, default=0)
