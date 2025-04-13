package com.ahch.controller;


import com.ahch.Repo.UserRepo;
import com.ahch.entity.Claim;
import com.ahch.entity.OurUsers;
import com.ahch.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:4200")
public class UserController {

    @Autowired
    UserService userService;
    UserRepo userRepo;

    @GetMapping("/get/Users")
    public List<OurUsers> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/get/User/{iduser}")
    public OurUsers getUser(@PathVariable Long iduser) {
        return userService.getuser(iduser);
    }

    @GetMapping("/get/Agents")
    public List<OurUsers> getAgents() {
        return userRepo.findByRole("agent");
    }




}
