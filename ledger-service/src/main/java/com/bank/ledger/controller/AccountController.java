package com.bank.ledger.controller;
import com.bank.ledger.dto.*;import com.bank.ledger.service.AccountService;import jakarta.validation.Valid;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/accounts")
public class AccountController {
 private final AccountService service;public AccountController(AccountService s){service=s;}
 @PostMapping public ResponseEntity<?> create(@Valid @RequestBody CreateAccountRequest r){return ResponseEntity.status(201).body(service.create(r));}
 @GetMapping("/{number}/balance") public ResponseEntity<?> balance(@PathVariable String number){return ResponseEntity.ok(service.get(number));}
 @GetMapping("/customer/{customer}") public ResponseEntity<?> listByCustomer(@PathVariable String customer){return ResponseEntity.ok(service.listByCustomer(customer));}
}
