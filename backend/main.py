from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.database import engine, Base
from app.routes import activity_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Activity Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(activity_router)


@app.get("/")
def read_root():
    return {"message": "Activity Builder API"}
