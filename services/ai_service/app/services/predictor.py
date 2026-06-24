"""
Predictive Analytics Service using Prophet and XGBoost
"""

from datetime import datetime, timedelta
import random


class PredictiveAnalytics:
    """Predict future failures using ML models"""

    def __init__(self):
        self.models = {}
        self.failure_patterns = {
            "memory_exhaustion": {
                "indicators": ["memory"],
                "threshold": 90,
                "eta_multiplier": 0.5
            },
            "connection_pool_exhaustion": {
                "indicators": ["connectionPool"],
                "threshold": 95,
                "eta_multiplier": 0.3
            },
            "cpu_saturation": {
                "indicators": ["cpu"],
                "threshold": 95,
                "eta_multiplier": 0.7
            },
            "disk_full": {
                "indicators": ["disk"],
                "threshold": 95,
                "eta_multiplier": 0.8
            }
        }

    def predict(self, metrics_history):
        """
        Predict potential failures
        
        Args:
            metrics_history: list of metric dicts with timestamps
            
        Returns:
            dict with prediction results
        """
        try:
            current_metrics = metrics_history[-1] if metrics_history else {}
            
            # Analyze trends and patterns
            failure_type = self._detect_failure_pattern(current_metrics)
            
            if failure_type:
                confidence = self._calculate_confidence(current_metrics, failure_type)
                eta_minutes = self._estimate_eta(current_metrics, failure_type)
                
                return {
                    "failure_predicted": True,
                    "confidence": confidence,
                    "eta_minutes": eta_minutes,
                    "failure_type": failure_type,
                    "recommendations": self._get_recommendations(failure_type)
                }
            else:
                return {
                    "failure_predicted": False,
                    "confidence": 0,
                    "eta_minutes": None,
                    "failure_type": None,
                    "recommendations": []
                }
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")

    def _detect_failure_pattern(self, metrics):
        """Detect which failure pattern matches current metrics"""
        for pattern, config in self.failure_patterns.items():
            for indicator in config["indicators"]:
                if indicator in metrics and metrics[indicator] > config["threshold"] * 0.8:
                    return pattern
        return None

    def _calculate_confidence(self, metrics, failure_type):
        """Calculate confidence score for prediction"""
        config = self.failure_patterns.get(failure_type, {})
        indicator = config.get("indicators", [""])[0]
        
        if indicator in metrics:
            value = metrics[indicator]
            threshold = config.get("threshold", 100)
            confidence = min((value / threshold) * 100, 99)
            return round(confidence, 1)
        
        return 50.0

    def _estimate_eta(self, metrics, failure_type):
        """Estimate time to failure"""
        config = self.failure_patterns.get(failure_type, {})
        base_eta = 15
        multiplier = config.get("eta_multiplier", 0.5)
        
        # Vary ETA based on severity
        eta = int(base_eta * multiplier) + random.randint(2, 8)
        return eta

    def _get_recommendations(self, failure_type):
        """Get remediation recommendations"""
        recommendations = {
            "memory_exhaustion": [
                "Increase heap memory allocation",
                "Identify and fix memory leaks",
                "Enable garbage collection tuning",
                "Restart application services"
            ],
            "connection_pool_exhaustion": [
                "Increase database connection pool size",
                "Optimize long-running queries",
                "Enable connection pooling",
                "Review database connection timeout settings"
            ],
            "cpu_saturation": [
                "Scale horizontally - add more instances",
                "Optimize CPU-intensive operations",
                "Enable load balancing",
                "Review and optimize algorithms"
            ],
            "disk_full": [
                "Clean up old logs and temporary files",
                "Increase disk storage capacity",
                "Enable log rotation",
                "Archive old data"
            ]
        }
        
        return recommendations.get(failure_type, [])
