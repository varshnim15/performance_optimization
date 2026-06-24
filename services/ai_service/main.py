"""
AI Service - FastAPI Application
Anomaly Detection, Predictive Analytics, Root Cause Analysis Engine
"""

from fastapi import FastAPI, WebSocket, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from app.services.anomaly_detector import AnomalyDetector
from app.services.predictor import PredictiveAnalytics
from app.services.root_cause_analyzer import RootCauseAnalyzer
from app.services.query_optimizer import QueryOptimizer
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Performance Optimizer AI Service",
    description="ML Engine for Anomaly Detection, Prediction & Root Cause Analysis",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
anomaly_detector = AnomalyDetector()
predictor = PredictiveAnalytics()
root_cause_analyzer = RootCauseAnalyzer()
query_optimizer = QueryOptimizer()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "ai-service",
        "version": "1.0.0"
    }


@app.post("/detect-anomalies")
async def detect_anomalies(metrics: dict):
    """Detect anomalies in metrics using Isolation Forest"""
    try:
        result = anomaly_detector.detect(metrics)
        return {
            "is_anomaly": result["is_anomaly"],
            "anomaly_score": result["anomaly_score"],
            "affected_metrics": result["affected_metrics"],
            "timestamp": result["timestamp"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/predict-failure")
async def predict_failure(metrics_history: list):
    """Predict potential failures using Prophet & XGBoost"""
    try:
        result = predictor.predict(metrics_history)
        return {
            "predicted_failure": result["failure_predicted"],
            "confidence": result["confidence"],
            "eta_minutes": result["eta_minutes"],
            "failure_type": result["failure_type"],
            "recommendations": result["recommendations"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/analyze-root-cause")
async def analyze_root_cause(alert_data: dict):
    """Analyze root cause of alerts using AI"""
    try:
        result = root_cause_analyzer.analyze(alert_data)
        return {
            "root_cause": result["root_cause"],
            "confidence": result["confidence"],
            "affected_components": result["affected_components"],
            "impact_assessment": result["impact_assessment"],
            "recommended_actions": result["recommended_actions"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/optimize-query")
async def optimize_query(sql_query: str):
    """Optimize SQL query using AI"""
    try:
        result = query_optimizer.optimize(sql_query)
        return {
            "original_query": sql_query,
            "optimized_query": result["optimized_query"],
            "performance_score": result["performance_score"],
            "improvement_percentage": result["improvement_percentage"],
            "suggested_indexes": result["suggested_indexes"],
            "explanation": result["explanation"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.websocket("/ws/ai-insights")
async def websocket_ai_insights(websocket: WebSocket):
    """WebSocket for real-time AI insights"""
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            response = await predict_failure(eval(data))
            await websocket.send_json(response)
    except Exception as e:
        print(f"WebSocket error: {e}")


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8001)),
        reload=os.getenv("ENV", "production") != "production"
    )
