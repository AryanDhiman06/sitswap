package com.example.sitswap.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.sitswap.model.DogsitRequest;
import com.example.sitswap.model.DogsitRequest.RequestStatus;
import com.example.sitswap.model.User;
import com.example.sitswap.repository.DogsitRequestRepository;
import com.example.sitswap.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class DogsitRequestService {
    
    @Autowired
    private final DogsitRequestRepository dogsitRepo;

    @Autowired
    private UserRepository userRepo;

    private static final int POINTS_PER_HOUR = 10;

    public DogsitRequestService(DogsitRequestRepository dogsitRepo){
        this.dogsitRepo = dogsitRepo;
    }

    public List<DogsitRequest> getAllRequests(){
        return dogsitRepo.findAll();
    }

    public List<DogsitRequest> getRequestsByStatus(RequestStatus status){
        return dogsitRepo.findByStatus(status);
    }

    public DogsitRequest createRequest(DogsitRequest request){
        request.setStatus(RequestStatus.PENDING);
        return dogsitRepo.save(request);
    }

    @Transactional
    public DogsitRequest acceptRequest(Long requestId, Long userId){
        DogsitRequest request = dogsitRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));

        User user = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if(request.getStatus() != RequestStatus.PENDING){
            throw new RuntimeException("Request already accepted or completed");
        }

        if(request.getOwner().getId().equals(user.getId())){
            throw new RuntimeException("Users cannot accept their own request");
        }

        request.setAcceptedBy(user);
        request.setStatus(RequestStatus.ACCEPTED);
        return dogsitRepo.save(request);
    }

    @Transactional
    public DogsitRequest completeRequest(Long requestId){
        DogsitRequest request = dogsitRepo.findById(requestId).orElseThrow(() -> new RuntimeException("Request not found"));

        if(request.getStatus() != RequestStatus.ACCEPTED){
            throw new IllegalStateException("Only accepted requests can be completed");
        }

        request.setStatus(RequestStatus.COMPLETED);

        User owner = request.getOwner();
        User sitter = request.getAcceptedBy();
        long duration = request.getDurationHours();
        int pointsToTransfer = (int)(duration * POINTS_PER_HOUR);

        if(owner.getPoints() < pointsToTransfer){
            throw new RuntimeException("Owner has insufficient points");
        }

        if(sitter == null || owner == null){
            throw new IllegalStateException("Missing sitter or owner for this request");
        }

        owner.setPoints(owner.getPoints() - pointsToTransfer);
        sitter.setPoints(sitter.getPoints() + pointsToTransfer);

        userRepo.save(owner);
        userRepo.save(sitter);
        dogsitRepo.save(request);
        
        return request;
    }
}
