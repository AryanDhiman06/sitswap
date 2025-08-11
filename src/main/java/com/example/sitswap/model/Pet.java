package com.example.sitswap.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "pets")
public class Pet {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private long id;
    
    @Column(nullable=false)
    private String name;

    @Column(nullable=false)
    private String breed;

    @Column(nullable=false)
    private Integer age;

    @Column(nullable=false)
    private String size;

    @Column(columnDefinition="TEXT")
    private String description;

    @Column(name="special_needs", columnDefinition="TEXT")
    private String specialNeeds;

    @Column(name="energy_level")
    private String energyLevel = "medium";

    @Column(name="image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id", nullable=false)
    @JsonIgnore
    private User user;

    public Pet(){

    }

    public Pet(String name, String breed, Integer age, String size, String description, String specialNeeds,
            String energyLevel, String imageUrl, User user) {
        this.name = name;
        this.breed = breed;
        this.age = age;
        this.size = size;
        this.description = description;
        this.specialNeeds = specialNeeds;
        this.energyLevel = energyLevel;
        this.imageUrl = imageUrl;
        this.user = user;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSpecialNeeds() {
        return specialNeeds;
    }

    public void setSpecialNeeds(String specialNeeds) {
        this.specialNeeds = specialNeeds;
    }

    public String getEnergyLevel() {
        return energyLevel;
    }

    public void setEnergyLevel(String energyLevel) {
        this.energyLevel = energyLevel;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Pet [id=" + id + ", name=" + name + ", breed=" + breed + ", age=" + age + ", size=" + size
                + ", description=" + description + ", specialNeeds=" + specialNeeds + ", energyLevel=" + energyLevel
                + ", user=" + user + "]";
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
