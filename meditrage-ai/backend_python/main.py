from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_engine import ml_engine
import uvicorn
import os
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Loading ML Engine...")
    ml_engine.train()
    yield
    # Shutdown (if needed)
    print("Shutting down...")

app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PatientData(BaseModel):
    name: str = "Unknown"
    age: str
    height: str = "0"
    weight: str = "0"
    heartRate: str
    bp: str
    temp: str
    symptoms: str

@app.post("/triage")
def triage(data: PatientData):
    result = ml_engine.predict(data.dict())
    return result

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
