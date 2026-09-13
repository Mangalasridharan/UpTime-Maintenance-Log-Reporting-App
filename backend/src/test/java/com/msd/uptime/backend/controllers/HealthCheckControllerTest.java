package com.msd.uptime.backend.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HealthCheckControllerTest {

    @Test
    void healthCheck_returnsUpWithServiceName() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new HealthCheckController()).build();

        mockMvc.perform(get("/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("UP"))
                .andExpect(jsonPath("$.data.service").value("uptime-maintenance-backend"))
                .andExpect(jsonPath("$.data.timestamp").exists());
    }
}