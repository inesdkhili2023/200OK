package com.ahch.Repo;

import com.ahch.entity.Claim;
import com.ahch.entity.OurUsers;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public interface UserRepo extends CrudRepository<OurUsers, Long> {
    List<OurUsers> findByRole(String role);
}
