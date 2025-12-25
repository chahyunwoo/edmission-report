from typing import List

CORS_ORIGINS: List[str] = [
    "http://localhost:5173",
    "http://localhost:3000",
]

DATABASE_URL = "sqlite:///./activities.db"

TIER_SCORES = {
    "School": 1,
    "Regional": 2,
    "State": 3,
    "National": 4,
    "International": 5,
}

CATEGORIES = [
    "Sports",
    "Arts",
    "Academic",
    "Community Service",
    "Leadership",
    "Other",
]

TIERS = [
    "School",
    "Regional",
    "State",
    "National",
    "International",
]
