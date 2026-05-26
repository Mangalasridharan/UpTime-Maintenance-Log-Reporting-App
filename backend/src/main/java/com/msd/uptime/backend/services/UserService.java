package com.msd.uptime.backend.services;
import com.msd.uptime.backend.models.User;

import java.util.List;

public interface UserService
{
    User createUser(User user);
    User getUserById(Long id);
    List<User> getAllUsers();
    void deleteUserById(Long id);
}
