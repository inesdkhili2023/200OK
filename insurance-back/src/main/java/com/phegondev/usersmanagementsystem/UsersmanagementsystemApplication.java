package com.phegondev.usersmanagementsystem;

import org.bytedeco.javacpp.Loader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class UsersmanagementsystemApplication {

	public static void main(String[] args) {


		Loader.load(org.bytedeco.opencv.global.opencv_core.class);
		Loader.load(org.bytedeco.openblas.global.openblas_nolapack.class);
		SpringApplication.run(UsersmanagementsystemApplication.class, args);
	}

}
