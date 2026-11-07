package com.bank.auth.entity;
import jakarta.persistence.*;
@Entity @Table(name="users")
public class User {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String username;
 @Column(nullable=false) private String password;
 @Column(nullable=false) private String role="ROLE_CUSTOMER";
 public Long getId(){return id;} public String getUsername(){return username;} public void setUsername(String v){username=v;}
 public String getPassword(){return password;} public void setPassword(String v){password=v;}
 public String getRole(){return role;} public void setRole(String v){role=v;}
}
