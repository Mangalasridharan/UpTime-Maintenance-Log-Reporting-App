package com.msd.uptime.backend.configurations;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI uptimeOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
                .components(new Components().addSecuritySchemes(SECURITY_SCHEME_NAME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("JWT token obtained from POST /uptime/api/v1/employee/auth/login")))
                .info(new Info()
                        .title("UpTime Maintenance Log Reporting API")
                        .description("""
                                REST API for the UpTime Maintenance Log Reporting application.

                                All endpoints respond with a standard envelope:
                                {
                                  "success": true,
                                  "message": "human readable message",
                                  "data": { ... },
                                  "timestamp": "2025-01-01T00:00:00Z"
                                }

                                Most endpoints require a JWT bearer token. Obtain one by calling
                                POST /uptime/api/v1/employee/auth/login with a registered email and password.
                                """)
                        .version("1.0.0"));
    }
}