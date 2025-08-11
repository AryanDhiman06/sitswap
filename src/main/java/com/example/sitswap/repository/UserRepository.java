package com.example.sitswap.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.sitswap.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    Optional<User> findUserByEmail(String email);
    Optional<User> findByUsername(String username);
}
