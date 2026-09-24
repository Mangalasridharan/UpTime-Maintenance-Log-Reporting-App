package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@Tag(name = "Health", description = "Application health check")
public class HealthCheckController {

    @GetMapping(value = {"/", "/health"})
    @Operation(summary = "Health check", description = "Returns the current service status. Used by load balancers and container health checks.")
    public ResponseEntity<ApiResponse<Map<String, String>>> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Service is healthy", Map.of(
            "status", "UP",
            "service", "uptime-maintenance-backend",
            "timestamp", Instant.now().toString()
        )));
    }
}