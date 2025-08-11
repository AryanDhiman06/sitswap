package com.example.sitswap.service;

import java.io.File;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.sitswap.model.Pet;
import com.example.sitswap.model.User;
import com.example.sitswap.repository.PetRepository;
import com.example.sitswap.repository.UserRepository;

@Service
public class PetService {
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    public PetService(PetRepository petRepository, UserRepository userRepository) {
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    public List<Pet> getPetsByUserId(Long userId){
        return petRepository.findByUserId(userId);
    }

    public Pet createPet(Long userId, Pet pet){
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        pet.setUser(user);
        return petRepository.save(pet);
    }

    public Optional<Pet> getPetById(Long petId){
        return petRepository.findById(petId);
    }

    public Pet updatePet(Long petId, Pet updatedPet){
        Pet existingPet = petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));

        existingPet.setName(updatedPet.getName());
        existingPet.setBreed(updatedPet.getBreed());
        existingPet.setAge(updatedPet.getAge());
        existingPet.setSize(updatedPet.getSize());
        existingPet.setDescription(updatedPet.getDescription());
        existingPet.setSpecialNeeds(updatedPet.getSpecialNeeds());
        existingPet.setEnergyLevel(updatedPet.getEnergyLevel());

        return petRepository.save(existingPet);
    }

    public void deletePet(Long petId){
        petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));
    
        petRepository.deleteById(petId);
    }

    @SuppressWarnings("UseSpecificCatch")
    public Pet uploadPetImage(Long petId, MultipartFile image) throws Exception{
        Pet pet = petRepository.findById(petId)
            .orElseThrow(() -> new RuntimeException("Pet not found"));

        if(image.isEmpty()){
            throw new RuntimeException("Please select a file to upload");
        }

        if(image.getSize() > 5 * 1024 * 1024){
            throw new RuntimeException("File size must be less than 5MB");
        }

        String contentType = image.getContentType();
        if(contentType == null || !contentType.startsWith("image/")){
            throw new RuntimeException("Only image files are allowed");
        }

        String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/images/pets/";
        File directory = new File(uploadDir);
        if(!directory.exists()){
            boolean created = directory.mkdirs();
            if(!created){
                throw new RuntimeException("Failed to create upload directory");
            }
        }

        String originalFilename = image.getOriginalFilename();
        if(originalFilename == null || originalFilename.isEmpty()){
            throw new RuntimeException("Invalid file name");
        }

        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = petId + "_" + System.currentTimeMillis() + fileExtension;

        String filepath = uploadDir + filename;
        File destinationFile = new File(filepath);

        try {
            image.transferTo(destinationFile);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save file: " + e.getMessage());
        }
        pet.setImageUrl("/images/pets/" + filename);
        return petRepository.save(pet);
    }
}
