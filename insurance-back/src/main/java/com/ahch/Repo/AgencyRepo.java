package com.ahch.Repo;

import com.ahch.entity.Agency;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgencyRepo extends CrudRepository<Agency, Long> {

}
