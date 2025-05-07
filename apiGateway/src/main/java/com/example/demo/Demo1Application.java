package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Demo1Application {

    public static void main(String[] args) {
        SpringApplication.run(Demo1Application.class, args);
    }
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route("JobOfferAppointment", r -> r.path("/jobapplications/**")
                        .uri("lb://JobOfferAppointment"))
                .route("usersmanagementsystem", r -> r.path("/user-service/**")
                        .uri("lb://usersmanagementsystem"))
                .route("towing-insurance" ,r -> r.path("/api/towings/**")
                        .uri("lb://towing-insurance"))
                .route("NOMPRENOMCLASSEEXAMEN", r -> r.path("/api/examen/**")
                        .uri("lb://NOMPRENOMCLASSEEXAMEN"))
                .route("DevisContratPaimentFacture", r->r.path("/devis/**")
                        .uri("lb://DevisContratPaimentFacture") )
                .route("ahch", r->r.path("/ahch/**")
                        .uri("lb://ahch") )
                .route("keycloak", r->r.path("/keycloak/**")
                        .uri("lb://keycloak") )

                .build();
    }
}

