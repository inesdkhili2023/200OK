package com.esprit.microservice.candidat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController

public class CandidatRestAPI {
    private String title="Hello, i'm the candidate Micro-Service";
    @RequestMapping("/salut")
    public String sayHello(){
        System.out.println(title);
        return title;
    }

}
