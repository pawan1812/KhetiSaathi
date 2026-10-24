#!/usr/bin/env python3
"""
KHETISAATHI — Python AI HTTP Microservice
FastAPI server serving /api/diagnose, /api/chat, /api/predict
for real-time leaf image scanning and AI answers.
"""

import os
import sys
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

from ai_engine import diagnose_leaf_image, chat_with_agri_assistant, predict_crop_intelligence

app = FastAPI(title="KhetiSaathi AI Microservice", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DiagnoseRequest(BaseModel):
    image: str
    language: Optional[str] = "mr"

class ChatRequest(BaseModel):
    messages: List[Dict[str, Any]]
    farmerContext: Optional[Dict[str, Any]] = None
    language: Optional[str] = "mr"
    image: Optional[str] = None

class PredictRequest(BaseModel):
    land: Optional[float] = 3.0
    soil: Optional[str] = "Medium Black Soil"
    season: Optional[str] = "Kharif"
    location: Optional[str] = "Maharashtra"
    irrigation: Optional[str] = "Drip"

@app.get("/health")
def health():
    return {"status": "ok", "service": "KhetiSaathi Python AI Engine"}

@app.post("/api/diagnose")
def diagnose(req: DiagnoseRequest):
    try:
        if not req.image or len(req.image) < 50:
            raise HTTPException(status_code=400, detail="Valid base64 image required")
        res = diagnose_leaf_image(req.image, req.language or "mr")
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat(req: ChatRequest):
    try:
        reply = chat_with_agri_assistant(req.messages, req.farmerContext, req.language or "mr", req.image)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict")
def predict(req: PredictRequest):
    try:
        res = predict_crop_intelligence(req.dict())
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PYTHON_AI_PORT", 8000))
    print(f"Starting KhetiSaathi Python AI Microservice on port {port}...")
    uvicorn.run(app, host="0.0.0.0", port=port)
