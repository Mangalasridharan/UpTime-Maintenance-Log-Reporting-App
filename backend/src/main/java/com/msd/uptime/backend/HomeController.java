package com.msd.uptime.backend;

import com.msd.uptime.backend.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uptime/api/v1/home")
@Tag(name = "Home", description = "Root endpoints")
public class HomeController
{
    @RequestMapping(value="/")
    @Operation(summary = "Welcome message")
    public ResponseEntity<ApiResponse<String>> home()
    {
        return ResponseEntity.ok(ApiResponse.<String>success("Welcome to Uptime Maintenance Log Reporting App", null));
    }
}