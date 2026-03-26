package com.teammatevoices;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class TeammateVoicesApplication {

    public static void main(String[] args) {
        SpringApplication.run(TeammateVoicesApplication.class, args);
    }
}
