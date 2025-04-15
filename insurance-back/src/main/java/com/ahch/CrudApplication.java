package com.ahch;

import com.ahch.Repo.TypeAssuranceRepository;
import com.ahch.entity.TypeAssurance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.stereotype.Service;

import java.util.List;
@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class CrudApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrudApplication.class, args);
	}

    @Service
    public static class TypeAssuranceService {
        @Autowired
        private TypeAssuranceRepository typeAssuranceRepository;

        public List<TypeAssurance> getAllTypes() {
            return typeAssuranceRepository.findAll();
        }
    }
}
