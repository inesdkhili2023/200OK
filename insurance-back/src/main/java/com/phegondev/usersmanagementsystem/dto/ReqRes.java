package com.phegondev.usersmanagementsystem.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.phegondev.usersmanagementsystem.entity.Civility;
import com.phegondev.usersmanagementsystem.entity.OurUsers;
import jakarta.persistence.Lob;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class ReqRes {

    private int statusCode;
    private String error;
    private String message;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private String email;
    private String name;
    private String lastname;
    private String password ;
    private Civility civility;
    private Date dnaiss;
    private String cin;
    private String image;
    private String city;
    private String role;
    private OurUsers ourUsers;
    private boolean locked;
    private boolean enabled;
    private List<OurUsers> ourUsersList;

}
