package com.phegondev.usersmanagementsystem.controller;

import com.phegondev.usersmanagementsystem.dto.ReqRes;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import com.phegondev.usersmanagementsystem.service.UsersManagementService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.view.RedirectView;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user-service")
public class UserManagementController {
    @Autowired
    private UsersManagementService usersManagementService;
    @GetMapping("/use")
    public String user(@AuthenticationPrincipal OAuth2User principal) {
        return "Bonjour, " + principal.getAttribute("name");
    }
    @PostMapping("/admin/register")
    public ResponseEntity<ReqRes> regeister(@RequestPart ReqRes reg,@RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        return ResponseEntity.ok(usersManagementService.register(reg,imageFile));
    }
    @PostMapping("/auth/signup")
    public ResponseEntity<ReqRes> signup(
            @ModelAttribute ReqRes reg,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile
    ) {
        return ResponseEntity.ok(usersManagementService.signup(reg, imageFile));
    }


    @GetMapping("/auth/signup/confirm")
    public RedirectView confirm(@RequestParam("token") String token) {
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

    @PostMapping("/auth/forgot-password")
    public ResponseEntity<ReqRes> forgotPassword(@RequestBody ReqRes request) {

            return ResponseEntity.ok( usersManagementService.sendResetPasswordEmail(request));

    }
    @PostMapping("/auth/reset-password")
    public ResponseEntity<ReqRes> resetPassword(@RequestBody ReqRes resetRequest) {
        try {
            ReqRes response = usersManagementService.resetPassword(resetRequest);
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            ReqRes errorResponse = new ReqRes();
            errorResponse.setMessage(e.getMessage());
            errorResponse.setStatusCode(HttpStatus.BAD_REQUEST.value());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) {
            ReqRes errorResponse = new ReqRes();
            errorResponse.setMessage("Une erreur s'est produite.");
            errorResponse.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

        @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());

    }


    @GetMapping("/allRole/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUsersById(userId));

    }

    @PutMapping("/allRole/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestPart OurUsers reqres, @RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
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
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    @PostMapping ("/admin/block/{userId}")
    public ResponseEntity<ReqRes> blockUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.blockUser(userId));
    }
    @PostMapping ("/admin/deblock/{userId}")
    public ResponseEntity<ReqRes> deblockUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deblockUser(userId));
    }

    @PostMapping("/auth/signupface")
    public ResponseEntity<ReqRes> signupface(@RequestPart ReqRes reg,@RequestPart(value = "imageFile", required = false) MultipartFile imageFile){
        return ResponseEntity.ok(usersManagementService.signupface(reg,imageFile));
    }

    @PostMapping("/auth/face-login")
    public ResponseEntity<ReqRes> faceLogin(@RequestBody Map<String, String> payload) {
        try {
            String imageData = payload.get("image");
            ReqRes result = usersManagementService.faceLogin(imageData);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            ReqRes errorRes = new ReqRes();
            errorRes.setStatusCode(401);
            errorRes.setMessage("Visage non reconnu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorRes);
        }
    }

}
