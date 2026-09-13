package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.HomeController;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HomeControllerTest {

    @Test
    void home_returnsWelcomeMessage() throws Exception {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(new HomeController()).build();

        mockMvc.perform(get("/uptime/api/v1/home/"))
                .andExpect(status().isOk())
                .andExpect(content().string("Welcome to Uptime Maintenance Log Reporting App"));
    }
}