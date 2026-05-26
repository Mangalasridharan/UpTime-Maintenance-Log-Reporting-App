package com.msd.uptime.backend;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/uptime/api/v1/home")
public class HomeController
{
    @RequestMapping(value="/")
    public String home()
    {
        return "Welcome to Uptime Maintenance Log Reporting App";
    }
}
