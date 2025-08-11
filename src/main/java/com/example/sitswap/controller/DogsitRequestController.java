package com.example.sitswap.controller;

import java.util.Base64;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.sitswap.model.DogsitRequest;
import com.example.sitswap.model.DogsitRequest.RequestStatus;
import com.example.sitswap.model.User;
import com.example.sitswap.repository.UserRepository;
import com.example.sitswap.service.DogsitRequestService;

@RestController
@RequestMapping(path="/dogsits")
public class DogsitRequestController {

    private final DogsitRequestService service;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DogsitRequestController(DogsitRequestService service, UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.service = service;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<DogsitRequest> getAll(){
        return service.getAllRequests();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody DogsitRequest request, @RequestHeader("Authorization") String authHeader){
        try {
            User authenticatedUser = getUserFromAuthHeader(authHeader);
            if(authenticatedUser == null){
                return ResponseEntity.status(401).body("Authentication failed");
            }

            request.setOwner(authenticatedUser);

            DogsitRequest createdRequest = service.createRequest(request);
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating request: " + e.getMessage());
        }
    }

    @PutMapping("/{requestId}/accept/{userId}")
    public ResponseEntity<Map<String, String>> acceptRequest(@PathVariable Long requestId, @PathVariable Long userId, @RequestHeader("Authorization") String authHeader){
        try {
            User authenticatedUser = getUserFromAuthHeader(authHeader);
            if(authenticatedUser == null || !authenticatedUser.getId().equals(userId)) {
                return ResponseEntity.status(401).body(Map.of("message", "Authentication failed"));
            }

            service.acceptRequest(requestId, userId);
            return ResponseEntity.ok(Map.of("message", "Request accepted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{requestId}/complete")
    public ResponseEntity<String> completeRequest(@PathVariable Long requestId, @RequestHeader("Authorization") String authHeader){
        try {
            User authenticatedUser = getUserFromAuthHeader(authHeader);
            if(authenticatedUser == null){
                return ResponseEntity.status(401).body("Authentication failed");
            }

            service.completeRequest(requestId);
            return ResponseEntity.ok("Request completed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/status/{status}")
    public List<DogsitRequest> getByStatus(@PathVariable String status){
        try {
            RequestStatus enumStatus = RequestStatus.valueOf(status.toUpperCase());
            return service.getRequestsByStatus(enumStatus);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Status must be PENDING, ACCEPTED, or COMPLETED");
        }
    }

    private User getUserFromAuthHeader(String authHeader){
        try {
            if(authHeader == null || !authHeader.startsWith("Basic ")) {
                return null;
            }

            String base64Credentials = authHeader.substring("Basic ".length());
            String credentials = new String(Base64.getDecoder().decode(base64Credentials));
            String[] parts = credentials.split(":", 2);

            if(parts.length != 2){
                return null;
            }

            String username = parts[0];
            String password = parts[1];

            User user = userRepository.findByUsername(username).orElse(null);
            if(user != null && passwordEncoder.matches(password, user.getPassword())){
                return user;
            }

            return null;
        } catch (Exception e){
            return null;
        }
    }
}
