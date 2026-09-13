package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping(value = {"/", "/health"})
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Service is healthy", Map.of(
            "status", "UP",
            "service", "uptime-maintenance-backend",
            "timestamp", Instant.now().toString()
        )));
    }
}