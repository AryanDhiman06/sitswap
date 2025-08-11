package com.example.sitswap.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.sitswap.model.DogsitRequest;
import com.example.sitswap.model.User;

public interface DogsitRequestRepository extends JpaRepository<DogsitRequest, Long>{
    
    List<DogsitRequest> findByOwner(User owner);

    List<DogsitRequest> findByStatus(String status);

    List<DogsitRequest> findByAcceptedBy(User user);

    List<DogsitRequest> findByStatus(DogsitRequest.RequestStatus status);
}
