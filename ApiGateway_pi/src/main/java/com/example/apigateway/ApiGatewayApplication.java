package com.example.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("usersmanagementsystem", r -> r.path("/user-service/**")
                        .uri("lb://usersmanagementsystem"))
                .route("200OK", r -> r.path("/**")
                        .uri("lb://200OK"))
                .route("AHCH", r -> r.path("/ahch-service/**")
                        .uri("lb://AHCH"))

                .build();
    }

}
