package com.uptime.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UpTimeController
{
    @GetMapping("/")
    public String Index()
    {
        return "Hello world from UpTimeController!";
    }
}
