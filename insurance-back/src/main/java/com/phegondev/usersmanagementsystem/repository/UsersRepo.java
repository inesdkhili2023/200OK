package com.phegondev.usersmanagementsystem.repository;


import com.phegondev.usersmanagementsystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
@Repository
public interface UsersRepo extends JpaRepository<OurUsers, Long> {

    Optional<OurUsers> findByEmail(String email);
    @Transactional
    @Modifying
    @Query("UPDATE OurUsers a " +
            "SET a.enabled = TRUE WHERE a.email = ?1")
    int enableOurUser(String email);

    List<OurUsers> findByRole(String role);
}
