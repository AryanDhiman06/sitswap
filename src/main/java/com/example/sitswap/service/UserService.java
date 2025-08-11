package com.example.sitswap.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.sitswap.model.User;
import com.example.sitswap.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo){
        this.userRepo = userRepo;
    }

    public List<User> getUsers(){
        return userRepo.findAll();
    }

    public User createNewUser(User user){
        return userRepo.save(user);
    }

    public Optional<User> getUserById(Long id){
        return userRepo.findById(id);
    }

    public void updatePoints(Long userId, int points){
        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPoints(user.getPoints() + points);
        userRepo.save(user);
    }
}
