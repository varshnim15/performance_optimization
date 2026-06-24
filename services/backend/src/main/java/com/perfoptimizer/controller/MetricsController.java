package com.perfoptimizer.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/metrics")
public class MetricsController {

    @GetMapping("/current")
    public ResponseEntity<Map<String, Object>> getCurrentMetrics() {
        Map<String, Object> metrics = new HashMap<>();
        metrics.put("cpu", Math.random() * 100);
        metrics.put("memory", 45 + Math.random() * 30);
        metrics.put("disk", 65 + Math.random() * 25);
        metrics.put("responseTime", 200 + Math.random() * 100);
        metrics.put("errorRate", Math.random() * 0.1);
        metrics.put("throughput", 5000 + Math.random() * 500);
        metrics.put("activeSessions", 1000 + (int)(Math.random() * 500));
        metrics.put("slowQueries", (int)(Math.random() * 20));
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/jmx")
    public ResponseEntity<Map<String, Object>> getJmxMetrics() {
        Map<String, Object> jmx = new HashMap<>();
        jmx.put("heapMemory", (long)(Math.random() * 1024 * 1024 * 1024));
        jmx.put("nonHeapMemory", (long)(Math.random() * 256 * 1024 * 1024));
        jmx.put("threadCount", 50 + (int)(Math.random() * 100));
        jmx.put("peakThreadCount", 150);
        return ResponseEntity.ok(jmx);
    }

    @GetMapping("/database")
    public ResponseEntity<Map<String, Object>> getDatabaseMetrics() {
        Map<String, Object> db = new HashMap<>();
        db.put("slowQueries", (int)(Math.random() * 20));
        db.put("connectionPoolUsage", 80 + Math.random() * 15);
        return ResponseEntity.ok(db);
    }

    @GetMapping("/network")
    public ResponseEntity<Map<String, Object>> getNetworkMetrics() {
        Map<String, Object> network = new HashMap<>();
        network.put("latency", 10 + Math.random() * 20);
        network.put("packetLoss", Math.random() * 0.2);
        return ResponseEntity.ok(network);
    }
}
