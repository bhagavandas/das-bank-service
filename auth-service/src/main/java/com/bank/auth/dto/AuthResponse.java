package com.bank.auth.dto;
public class AuthResponse {
 private String token; private String tokenType="Bearer"; private String username;
 public AuthResponse(String t,String u){token=t;username=u;}
 public String getToken(){return token;} public String getTokenType(){return tokenType;} public String getUsername(){return username;}
}
