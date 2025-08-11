package com.example.sitswap.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sitswap.model.User;
import com.example.sitswap.repository.UserRepository;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            if(userRepository.findByUsername(request.getUsername()).isPresent()){
                return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
            }

            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setUsername(request.getUsername());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPoints(100);

            User savedUser = userRepository.save(user);

            return ResponseEntity.ok(createUserResponse(savedUser));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create account: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

            if(userOpt.isEmpty()){
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
            }

            User user = userOpt.get();

            if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password"));
            }

            return ResponseEntity.ok(createUserResponse(user));
        } catch (Exception e){
            return ResponseEntity.badRequest().body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }

    private Map<String, Object> createUserResponse(User user){
        return Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "username", user.getUsername(),
            "points", user.getPoints()
        );
    }

    public static class SignupRequest {
        private String name;
        private String email;
        private String username;
        private String password;
        public String getName() {
            return name;
        }
        public void setName(String name) {
            this.name = name;
        }
        public String getEmail() {
            return email;
        }
        public void setEmail(String email) {
            this.email = email;
        }
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
    }
}
