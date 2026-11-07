package com.bank.transfer.controller;
import com.bank.transfer.dto.*;import com.bank.transfer.service.TransferService;import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/transfers")
public class TransferController {
 private final TransferService service;public TransferController(TransferService s){service=s;}
 @PostMapping public ResponseEntity<?> transfer(@Valid @RequestBody TransferRequest r){return ResponseEntity.ok(service.initiate(r));}
 @GetMapping("/{reference}") public ResponseEntity<?> status(@PathVariable String reference){return ResponseEntity.ok(service.getStatus(reference));}
}
