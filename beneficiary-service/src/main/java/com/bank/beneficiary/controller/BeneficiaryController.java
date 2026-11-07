package com.bank.beneficiary.controller;
import com.bank.beneficiary.dto.*;import com.bank.beneficiary.service.BeneficiaryService;import jakarta.validation.Valid;
import org.springframework.http.*;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/beneficiaries")
public class BeneficiaryController {
 private final BeneficiaryService service;public BeneficiaryController(BeneficiaryService s){service=s;}
 @PostMapping public ResponseEntity<?> add(@Valid @RequestBody BeneficiaryRequest r){return ResponseEntity.status(201).body(service.add(r));}
 @GetMapping("/customer/{customer}") public ResponseEntity<?> list(@PathVariable String customer){return ResponseEntity.ok(service.list(customer));}
 @DeleteMapping("/{id}/customer/{customer}") public ResponseEntity<?> delete(@PathVariable Long id,@PathVariable String customer){service.delete(id,customer);return ResponseEntity.noContent().build();}
}
