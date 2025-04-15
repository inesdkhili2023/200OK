package com.ahch.service;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "usersmanagementsystem")
public interface UserServiceClient {
    @GetMapping("/user-service/admin/get-all-users")
    ResponseEntity<ReqRes> getAllUsers(@RequestHeader("Authorization") String token);
}
