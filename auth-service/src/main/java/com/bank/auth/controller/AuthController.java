package com.bank.auth.controller;

import com.bank.auth.dto.*;
import com.bank.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	private final AuthService service;

	public AuthController(AuthService s) {
		service = s;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r) {
		service.register(r);
		return ResponseEntity.status(201).body(java.util.Map.of("message", "User registered"));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest r) {
		return ResponseEntity.ok(service.login(r));
	}
}
