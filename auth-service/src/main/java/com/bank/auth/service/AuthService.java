package com.bank.auth.service;
import com.bank.auth.dto.*;
import com.bank.auth.entity.User;
import com.bank.auth.repository.UserRepository;
import com.bank.auth.security.JwtSupport;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
@Service
public class AuthService {
 private final UserRepository users; private final PasswordEncoder encoder; private final JwtSupport jwt;
 public AuthService(UserRepository u,PasswordEncoder e,JwtSupport j){users=u;encoder=e;jwt=j;}
 public void register(RegisterRequest r){
  if(users.existsByUsername(r.getUsername())) throw new IllegalArgumentException("Username already exists");
  User u=new User();u.setUsername(r.getUsername());u.setPassword(encoder.encode(r.getPassword()));users.save(u);
 }
 public AuthResponse login(LoginRequest r){
  User u=users.findByUsername(r.getUsername()).orElseThrow(()->new IllegalArgumentException("Invalid username or password"));
  if(!encoder.matches(r.getPassword(),u.getPassword()))throw new IllegalArgumentException("Invalid username or password");
  return new AuthResponse(jwt.create(u.getUsername()),u.getUsername());
 }
}
