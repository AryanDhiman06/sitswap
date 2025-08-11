package com.example.sitswap.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.sitswap.model.Pet;
import com.example.sitswap.model.User;
import com.example.sitswap.service.PetService;
import com.example.sitswap.service.UserService;


@RestController
@RequestMapping(path="/users")
public class UserController {
    private final UserService userService;
    private final PetService petService;

    public UserController(UserService service, PetService petService){
        this.userService = service;
        this.petService = petService;
    }

    @GetMapping
    public List<User> getAllUsers(){
        return userService.getUsers();
    }

    @PostMapping
    public User createUser(@RequestBody User user){
        return userService.createNewUser(user);
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/{id}/points")
    public void updatePoints(@PathVariable Long id, @RequestParam int points) {
        userService.updatePoints(id, points);
    }

    @GetMapping("/{id}/pets")
    public List<Pet> getUserPets(@PathVariable Long id) {
        return petService.getPetsByUserId(id);
    }

    @PostMapping("/{id}/pets")
    public ResponseEntity<Pet> createPetForUser(@PathVariable Long id, @RequestBody Pet pet) {
        try {
            Pet createdPet = petService.createPet(id, pet);
            return ResponseEntity.ok(createdPet);
        } catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }
}
