package com.perfoptimizer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Performance Optimizer Backend Application
 * Main entry point for Spring Boot application
 */
@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = {"com.perfoptimizer"})
public class PerfOptimizerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PerfOptimizerApplication.class, args);
    }
}
