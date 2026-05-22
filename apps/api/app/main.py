from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import analyze, suggest

app = FastAPI(title="SafeTrade API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze.router, prefix="/api")
app.include_router(suggest.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "SafeTrade API Running"}
