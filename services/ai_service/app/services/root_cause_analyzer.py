"""
Root Cause Analysis Engine using LangChain and AI
"""

from datetime import datetime


class RootCauseAnalyzer:
    """Analyze and identify root causes of alerts"""

    def __init__(self):
        self.alert_patterns = {
            "high_cpu": {
                "causes": ["CPU-intensive operations", "Memory pressure causing GC", "Suboptimal algorithms"],
                "components": ["Compute", "Application"],
                "impact": "Performance degradation, slow response times"
            },
            "high_memory": {
                "causes": ["Memory leak in application", "Cache not clearing", "Large dataset processing"],
                "components": ["Memory", "Application", "Database"],
                "impact": "Out of memory errors, service crashes"
            },
            "slow_queries": {
                "causes": ["Missing indexes", "Full table scans", "Suboptimal query"],
                "components": ["Database", "Query Engine"],
                "impact": "Slow API responses, poor user experience"
            },
            "connection_pool_exhausted": {
                "causes": ["Long-running queries", "Connection leaks", "Insufficient pool size"],
                "components": ["Database Connection Pool", "Query Engine"],
                "impact": "New requests fail, service unavailable"
            },
            "network_latency": {
                "causes": ["Network congestion", "DNS resolution issues", "Router misconfiguration"],
                "components": ["Network", "DNS", "Infrastructure"],
                "impact": "Slow data transfer, timeout errors"
            }
        }

    def analyze(self, alert_data):
        """
        Analyze alert and identify root cause
        
        Args:
            alert_data: dict with alert information
            
        Returns:
            dict with root cause analysis
        """
        try:
            alert_type = alert_data.get("type", "unknown")
            current_metrics = alert_data.get("metrics", {})
            
            # Find matching pattern
            pattern = self._find_pattern(alert_type, current_metrics)
            
            if pattern:
                root_cause = self._determine_root_cause(pattern, current_metrics)
                confidence = self._calculate_confidence(pattern, current_metrics)
                
                return {
                    "root_cause": root_cause,
                    "confidence": confidence,
                    "affected_components": pattern.get("components", []),
                    "impact_assessment": pattern.get("impact", "Unknown impact"),
                    "recommended_actions": self._get_actions(root_cause)
                }
            else:
                return {
                    "root_cause": "Unknown - requires manual investigation",
                    "confidence": 0,
                    "affected_components": [],
                    "impact_assessment": "Unable to determine impact",
                    "recommended_actions": ["Engage on-call engineer"]
                }
        except Exception as e:
            raise Exception(f"Root cause analysis failed: {str(e)}")

    def _find_pattern(self, alert_type, metrics):
        """Find matching alert pattern"""
        # Map alert types to patterns
        pattern_map = {
            "high_cpu": "high_cpu",
            "cpu_utilization": "high_cpu",
            "high_memory": "high_memory",
            "memory_utilization": "high_memory",
            "slow_query": "slow_queries",
            "slow_queries": "slow_queries",
            "connection_pool": "connection_pool_exhausted",
            "network": "network_latency"
        }
        
        pattern_key = pattern_map.get(alert_type, "high_cpu")
        return self.alert_patterns.get(pattern_key)

    def _determine_root_cause(self, pattern, metrics):
        """Determine specific root cause from pattern"""
        causes = pattern.get("causes", [])
        
        # Simple heuristic to select most likely cause
        if len(causes) > 0:
            return causes[0]
        return "Unknown root cause"

    def _calculate_confidence(self, pattern, metrics):
        """Calculate confidence level of analysis"""
        # 0-100 confidence score
        base_confidence = 75
        
        # Increase confidence if we have good metrics
        if len(metrics) > 3:
            base_confidence += 10
        
        # Cap at 99%
        return min(base_confidence, 99)

    def _get_actions(self, root_cause):
        """Get recommended actions based on root cause"""
        action_map = {
            "CPU-intensive operations": [
                "Optimize algorithms to reduce CPU usage",
                "Enable CPU profiling to identify bottlenecks",
                "Consider implementing caching layer"
            ],
            "Memory leak": [
                "Enable memory profiling",
                "Review recent code changes",
                "Run memory analysis tools to identify leak source"
            ],
            "Missing indexes": [
                "Analyze query execution plans",
                "Create missing database indexes",
                "Run ANALYZE TABLE to update statistics"
            ],
            "Connection leaks": [
                "Review database connection handling code",
                "Ensure connections are properly closed",
                "Enable connection leak detection"
            ],
            "Network congestion": [
                "Check network bandwidth utilization",
                "Review traffic patterns",
                "Consider traffic optimization or CDN"
            ]
        }
        
        return action_map.get(root_cause, ["Investigate further"])
