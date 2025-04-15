package com.ahch.service;

import com.ahch.entity.OurUsers;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OtherService {

    @Autowired
    private UserServiceClient userServiceClient;

    public List<OurUsers> getAllUsers(String jwtToken) {
        String finalToken = jwtToken.startsWith("Bearer ") ? jwtToken : "Bearer " + jwtToken;
        ReqRes response = userServiceClient.getAllUsers(finalToken).getBody();
        System.out.println("Sending token: [" + finalToken + "]");
        return response != null ? response.getOurUsersList() : List.of();
    }
}
