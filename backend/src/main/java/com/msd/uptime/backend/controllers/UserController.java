package com.msd.uptime.backend.controllers;

import com.msd.uptime.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.msd.uptime.backend.models.User;

import java.util.List;

@RestController
@RequestMapping("/uptime/api/v1/users")
public class UserController
{
    @Autowired
    private UserService userService;

    @PostMapping()
    public User createUser(@RequestBody User user)
    {
        return userService.createUser(user);
    }

    @GetMapping("{id}")
    public User getUser(@PathVariable Long id)
    {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id){
        userService.deleteUserById(id);
        return "User has been deleted";
    }

    @GetMapping()
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}
