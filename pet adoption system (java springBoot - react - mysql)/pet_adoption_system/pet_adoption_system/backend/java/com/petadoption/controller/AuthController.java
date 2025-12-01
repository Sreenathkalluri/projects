package com.petadoption.controller;

import com.petadoption.entity.User;
import com.petadoption.service.PetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend requests
public class AuthController {

    @Autowired
    private PetService service;

    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody User user) {
        User savedUser = service.signup(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User loggedIn = service.login(user.getUsername(), user.getPassword());
        if (loggedIn != null) {
            return ResponseEntity.ok(loggedIn);
        } else {
            return ResponseEntity.status(401).body(null);
        }
    }

    // Optional endpoint to check login status
    @GetMapping("/login")
    public ResponseEntity<String> loginCheck() {
        return ResponseEntity.ok("Login endpoint is working. Use POST to login.");
    }
}
