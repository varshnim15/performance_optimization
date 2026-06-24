"""
Anomaly Detection Service using Isolation Forest and other ML algorithms
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime
import json


class AnomalyDetector:
    """Detect anomalies in system metrics"""

    def __init__(self, contamination=0.05):
        self.model = IsolationForest(contamination=contamination, random_state=42)
        self.contamination = contamination
        self.is_fitted = False

    def detect(self, metrics):
        """
        Detect anomalies in provided metrics
        
        Args:
            metrics: dict with metric name -> value pairs
            
        Returns:
            dict with anomaly detection results
        """
        try:
            metric_values = np.array([list(metrics.values())])
            
            # For demo, use simple threshold-based detection
            anomalies = self._threshold_detection(metrics)
            
            return {
                "is_anomaly": anomalies["is_anomaly"],
                "anomaly_score": anomalies["score"],
                "affected_metrics": anomalies["affected"],
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            raise Exception(f"Anomaly detection failed: {str(e)}")

    def _threshold_detection(self, metrics):
        """Simple threshold-based anomaly detection"""
        thresholds = {
            "cpu": 90,
            "memory": 90,
            "disk": 90,
            "responseTime": 1000,
            "errorRate": 5
        }
        
        affected_metrics = []
        score = 0.0
        
        for metric, value in metrics.items():
            if metric in thresholds and value > thresholds[metric]:
                affected_metrics.append(metric)
                score += (value - thresholds[metric]) / thresholds[metric] * 0.1
        
        score = min(score, 1.0)
        is_anomaly = score > 0.3 or len(affected_metrics) > 0
        
        return {
            "is_anomaly": is_anomaly,
            "score": score,
            "affected": affected_metrics
        }

    def train(self, data):
        """Train anomaly detection model on historical data"""
        if len(data) > 0:
            X = np.array([list(d.values()) for d in data])
            self.model.fit(X)
            self.is_fitted = True
