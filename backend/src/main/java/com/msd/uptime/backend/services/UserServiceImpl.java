package com.msd.uptime.backend.services;

import com.msd.uptime.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.msd.uptime.backend.models.User;

import java.util.List;

@Service
public class UserServiceImpl implements UserService
{
    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

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

    public User register(User user){

        user.setPassword(encoder.encode(user.getPassword()));
        System.out.println("The password is "+user.getPassword());
        return  userRepository.save(user);
    }

    public Boolean authenticate(String email, String password){
        User user = userRepository.findByEmail(email);
        System.out.println("The email is "+user.getEmail());
        if(user==null){
            return false;
        }
        return encoder.matches(password, user.getPassword());
    }

}
