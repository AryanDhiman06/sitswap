package com.example.sitswap.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table
public class DogsitRequest {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;

    private String petName;
    private String petBreed;
    private Integer petAge;
    private String petSize;
    private String petDescription;
    private String petSpecialNeeds;
    private String petEnergyLevel;
    private String petImageUrl;

    @ManyToOne
    private Pet pet;
    

    @ManyToOne
    private User owner;

    @ManyToOne
    private User acceptedBy;

    public enum RequestStatus{
        PENDING,
        ACCEPTED,
        COMPLETED
    }

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    public DogsitRequest() {
        this.status = RequestStatus.PENDING;
    }

    public DogsitRequest(Long id, String description, String location, LocalDateTime startTime, LocalDateTime endTime, User owner, User acceptedBy,
            RequestStatus status) {
        this.id = id;
        this.description = description;
        this.location = location;
        this.startTime = startTime;
        this.endTime = endTime;
        this.owner = owner;
        this.acceptedBy = acceptedBy;
        this.status = status;
    }

    public DogsitRequest(String description, LocalDateTime startTime, LocalDateTime endTime, String location, User owner, User acceptedBy,
            RequestStatus status) {
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.owner = owner;
        this.acceptedBy = acceptedBy;
        this.status = status;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getPetBreed() {
        return petBreed;
    }

    public void setPetBreed(String petBreed) {
        this.petBreed = petBreed;
    }

    public Integer getPetAge() {
        return petAge;
    }

    public void setPetAge(Integer petAge) {
        this.petAge = petAge;
    }

    public String getPetSize() {
        return petSize;
    }

    public void setPetSize(String petSize) {
        this.petSize = petSize;
    }

    public String getPetDescription() {
        return petDescription;
    }

    public void setPetDescription(String petDescription) {
        this.petDescription = petDescription;
    }

    public String getPetSpecialNeeds() {
        return petSpecialNeeds;
    }

    public void setPetSpecialNeeds(String petSpecialNeeds) {
        this.petSpecialNeeds = petSpecialNeeds;
    }

    public String getPetEnergyLevel() {
        return petEnergyLevel;
    }

    public void setPetEnergyLevel(String petEnergyLevel) {
        this.petEnergyLevel = petEnergyLevel;
    }

    public String getPetImageUrl() {
        return petImageUrl;
    }

    public void setPetImageUrl(String petImageUrl) {
        this.petImageUrl = petImageUrl;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getAcceptedBy() {
        return acceptedBy;
    }

    public void setAcceptedBy(User acceptedBy) {
        this.acceptedBy = acceptedBy;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Long getDurationHours(){
        if(startTime != null && endTime != null){
            return java.time.Duration.between(startTime, endTime).toHours();
        }else{
            return 0L;
        }
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public boolean isCompleted(){
        return this.status == RequestStatus.COMPLETED;
    }

    public boolean isAccepted(){
        return this.status == RequestStatus.ACCEPTED;
    }
  
}
