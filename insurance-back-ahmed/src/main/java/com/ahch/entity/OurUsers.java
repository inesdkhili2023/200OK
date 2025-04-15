package com.ahch.entity;


import com.ahch.entity.Civility;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;


import java.util.Collection;
import java.util.Date;
import java.util.List;

import jakarta.persistence.*;
import lombok.Data;


@Data
public class OurUsers  {


    private Integer id;
    private String email;
    private String name;
    private String lastname;
    private String password;

    private Civility civility;
    private Date dnaiss;
    private String cin;
    private String image;
    private String city;
    private String role;
    private String faceEmbedding;
    private boolean locked=false;
    private boolean enabled=false;



}
