package com.example.demo.controller;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.RegisterRequest;
import com.example.demo.dto.response.LoginResponse;
import com.example.demo.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
    }

    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("accessToken", response.getAccessToken())
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(86400) // 1 day
            .sameSite("Lax")
            .build();
            
        // Optional: clear token from response body to prevent JS access
        response.setAccessToken(""); 
        
        return org.springframework.http.ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
            .body(response);
    }
    
    @PostMapping("/logout")
    public org.springframework.http.ResponseEntity<Void> logout() {
        org.springframework.http.ResponseCookie cookie = org.springframework.http.ResponseCookie.from("accessToken", "")
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0) // delete cookie
            .sameSite("Lax")
            .build();
            
        return org.springframework.http.ResponseEntity.ok()
            .header(org.springframework.http.HttpHeaders.SET_COOKIE, cookie.toString())
            .build();
    }
}
