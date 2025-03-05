package com.ahch.service;

import com.ahch.Repo.AgencyRepo;
import com.ahch.entity.Agency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AgencyService {
    @Autowired
    private AgencyRepo agencyRepo;

    public Agency saveAgency(Agency agency) {
        return agencyRepo.save(agency);
    }

    public List<Agency> getAgencys() {
        List<Agency> agencys = new ArrayList<>();
        agencyRepo.findAll().forEach(agencys::add);
        return agencys;
    }

    public Agency getAgencys(Long agencyId) {
        return agencyRepo.findById(agencyId).orElseThrow();
    }

    public void deleteAgency(Long agencyId) {
        agencyRepo.deleteById(agencyId);
    }

    public Agency updateAgency(Agency agency) {
        agencyRepo.findById(agency.getIdAgency());
        return agencyRepo.save(agency);
    }
}
