package com.msd.uptime.backend.services;

import com.msd.uptime.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.msd.uptime.backend.models.User;

import java.util.List;

@Service
public class UserServiceImpl implements UserService
{
    @Autowired
    private UserRepository userRepository;

    public User createUser(User user)
    {
        return userRepository.save(user);
    }

    public User getUserById(Long id)
    {
        return userRepository.findById(id).orElse(null);
    }

    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }

    public void  deleteUserById(Long id)
    {
        userRepository.deleteById(id);
    }

}
