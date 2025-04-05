package com.ahch.service;

import com.ahch.Repo.UserRepo;
import com.ahch.entity.OurUsers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class UserService{
    @Autowired
    UserRepo userRepo;


    public List<OurUsers> getUsers() {
        List<OurUsers> users = new ArrayList<>();
        userRepo.findAll().forEach(users::add);
        return users;
    }

    public OurUsers getuser(Long userId) {
        return userRepo.findById(userId).orElseThrow();
    }
}
