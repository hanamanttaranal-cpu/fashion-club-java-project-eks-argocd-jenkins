package com.atelier.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final String ADMIN_EMAIL = "hanamanttaranal19@gmail.com";
    private static final String ADMIN_PASS = "12345";

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Map<String, Object> response = new HashMap<>();

        if (ADMIN_EMAIL.equalsIgnoreCase(email) && (ADMIN_PASS.equals(password) || "123456".equals(password))) {
            response.put("status", "SUCCESS");
            response.put("message", "Admin authentication successful");
            response.put("role", "ADMIN");
            response.put("email", ADMIN_EMAIL);
            response.put("displayName", "Admin Hanamant Taranal");
            response.put("token", "bearer-token-admin-hanamant-2026");
            return ResponseEntity.ok(response);
        }

        // Standard Customer Login Logic
        if (email != null && !email.isBlank()) {
            response.put("status", "SUCCESS");
            response.put("message", "Customer login successful");
            response.put("role", "CUSTOMER");
            response.put("email", email);
            response.put("displayName", email.split("@")[0]);
            response.put("token", "bearer-token-cust-" + System.currentTimeMillis());
            return ResponseEntity.ok(response);
        }

        response.put("status", "ERROR");
        response.put("message", "Invalid email or password");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean isAdmin = ADMIN_EMAIL.equalsIgnoreCase(email);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", isAdmin ? "Admin account registered" : "Customer account created");
        response.put("role", isAdmin ? "ADMIN" : "CUSTOMER");
        response.put("email", email);
        response.put("displayName", request.getOrDefault("displayName", email != null ? email.split("@")[0] : "User"));
        return ResponseEntity.ok(response);
    }
}
