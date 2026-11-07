package com.bank.fraud.controller;
import com.bank.fraud.dto.*;import com.bank.fraud.service.FraudDetectionService;import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/fraud")
public class FraudController {
 private final FraudDetectionService service;public FraudController(FraudDetectionService s){service=s;}
 @PostMapping("/check") public ResponseEntity<?> check(@Valid @RequestBody FraudCheckRequest r){return ResponseEntity.ok(service.check(r));}
 @GetMapping("/{reference}") public ResponseEntity<?> get(@PathVariable String reference){return ResponseEntity.ok("Use fraud history repository for reference "+reference);}
}
