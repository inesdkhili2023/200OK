package com.ahch.Repo;

import com.ahch.entity.Claim;
import com.ahch.entity.OurUsers;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface UserRepo extends CrudRepository<OurUsers, Long> {
}
