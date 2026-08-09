package com.atelier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Atelier Haute Couture & Fashion Club - Java Spring Boot Backend Entrypoint
 * Supports Admin Auth (ID: hanamanttaranal19@gmail.com / Pass: 12345),
 * Customer Management, Order Processing & EKS / ArgoCD / Jenkins CI-CD Deployments.
 */
@SpringBootApplication
public class AtelierFashionBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AtelierFashionBackendApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  ATELIER HAUTE COUTURE BACKEND STARTED        ");
        System.out.println("  Admin Login: hanamanttaranal19@gmail.com    ");
        System.out.println("  Server running on port 8080                  ");
        System.out.println("=================================================");
    }
}
