package com.ahch.Repo;

import com.ahch.entity.Claim;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClaimRepo extends CrudRepository<Claim, Long> {
}
