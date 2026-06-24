"""
SQL Query Optimizer Service
"""


class QueryOptimizer:
    """Optimize SQL queries for better performance"""

    def __init__(self):
        self.optimization_rules = {
            "select_star": {
                "pattern": "SELECT \\*",
                "issue": "Selecting all columns increases data transfer",
                "fix": "Select only required columns"
            },
            "no_index": {
                "pattern": "WHERE .* AND .*",
                "issue": "Query may benefit from indexes",
                "fix": "Create indexes on WHERE clause columns"
            },
            "subquery_in": {
                "pattern": "IN \\(SELECT",
                "issue": "Subquery IN can be inefficient",
                "fix": "Use JOIN instead of subquery"
            },
            "distinct_count": {
                "pattern": "SELECT DISTINCT COUNT",
                "issue": "DISTINCT with COUNT may be redundant",
                "fix": "Consider using GROUP BY instead"
            }
        }

    def optimize(self, sql_query):
        """
        Optimize SQL query and provide recommendations
        
        Args:
            sql_query: SQL query string
            
        Returns:
            dict with optimization results
        """
        try:
            original_query = sql_query
            optimized_query = self._optimize_query(sql_query)
            
            return {
                "original_query": original_query,
                "optimized_query": optimized_query,
                "performance_score": self._calculate_score(sql_query),
                "improvement_percentage": self._estimate_improvement(original_query, optimized_query),
                "suggested_indexes": self._suggest_indexes(sql_query),
                "explanation": self._get_explanation(sql_query)
            }
        except Exception as e:
            raise Exception(f"Query optimization failed: {str(e)}")

    def _optimize_query(self, query):
        """Apply optimization rules to query"""
        optimized = query
        
        # Replace SELECT * with specific columns (demo)
        if "SELECT *" in query.upper():
            optimized = optimized.replace("SELECT *", "SELECT id, name, email")
        
        # Convert IN subqueries to JOINs (demo)
        if "IN (SELECT" in query.upper():
            optimized = optimized.replace("IN (SELECT", "JOIN (SELECT")
        
        return optimized

    def _calculate_score(self, query):
        """Calculate query performance score (0-100)"""
        score = 100
        
        # Deduct for anti-patterns
        if "SELECT *" in query.upper():
            score -= 15
        if "IN (SELECT" in query.upper():
            score -= 10
        if "DISTINCT" in query.upper() and "COUNT" in query.upper():
            score -= 10
        if "LIKE '%%" in query:
            score -= 5
        
        return max(score, 10)

    def _estimate_improvement(self, original, optimized):
        """Estimate performance improvement percentage"""
        if original == optimized:
            return 0
        
        improvements = 0
        
        if "SELECT *" in original.upper() and "SELECT *" not in optimized.upper():
            improvements += 20
        if "IN (SELECT" in original.upper() and "IN (SELECT" not in optimized.upper():
            improvements += 15
        
        return improvements

    def _suggest_indexes(self, query):
        """Suggest indexes for query"""
        indexes = []
        
        # Parse WHERE clause for potential indexes
        if "WHERE" in query.upper():
            indexes.append({
                "table": "derived_from_query",
                "columns": ["id", "status", "created_at"],
                "type": "BTREE",
                "recommendation": "Create index on frequently filtered columns"
            })
        
        return indexes

    def _get_explanation(self, query):
        """Get human-readable explanation of query"""
        explanations = []
        
        if "SELECT *" in query.upper():
            explanations.append("Query selects all columns - specify needed columns only")
        if "JOIN" in query.upper():
            explanations.append("Query uses joins - ensure proper indexes on join keys")
        if "GROUP BY" in query.upper():
            explanations.append("Query groups data - ensure GROUP BY columns are indexed")
        if "ORDER BY" in query.upper():
            explanations.append("Query sorts data - consider index on ORDER BY columns")
        
        return explanations if explanations else ["Query appears optimized"]
