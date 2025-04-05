package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.dto.ReqRes;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.UsersManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

@RestController
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;

    @PostMapping("/admin/register")
    public ResponseEntity<ReqRes> regeister(@RequestPart ReqRes reg,@RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        return ResponseEntity.ok(usersManagementService.register(reg,imageFile));
    }
    @PostMapping("/auth/signup")
    public ResponseEntity<ReqRes> signup(@RequestPart ReqRes reg,@RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        return ResponseEntity.ok(usersManagementService.signup(reg,imageFile));
    }
    @GetMapping("/auth/signup/confirm")
    public String confirm(@RequestParam("token") String token) {
         return usersManagementService.confirmToken(token);

    }
    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path imagePath = Paths.get("uploads").resolve(filename);
            Resource imageResource = new UrlResource(imagePath.toUri());

            if (imageResource.exists() && imageResource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_PNG)
                        .body(imageResource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }



    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){

        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());

    }


    @GetMapping("/adminuser/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Long userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/adminuser/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Long userId, @RequestPart OurUsers reqres, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres,imageFile));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @GetMapping("/allRole/get-all-profile")
    public ResponseEntity<ReqRes> getProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Long userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @PostMapping("/admin/{userId}/assign-to-agency/{agencyId}")
    public ResponseEntity<ReqRes> assignAgencyToUser(@PathVariable Long userId, @PathVariable Long agencyId) {
        return ResponseEntity.ok(usersManagementService.assignAgencyToUser(userId, agencyId));
    }
}
