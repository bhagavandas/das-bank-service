package com.bank.ledger.controller;
import com.bank.ledger.dto.*;import com.bank.ledger.service.LedgerService;import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/ledger")
public class LedgerController {
 private final LedgerService service;public LedgerController(LedgerService s){service=s;}
 @PostMapping("/process") public ResponseEntity<?> process(@Valid @RequestBody LedgerOperationRequest r){return ResponseEntity.ok(service.process(r));}
}
