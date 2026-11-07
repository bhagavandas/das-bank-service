package com.bank.ledger.controller;
import com.bank.ledger.repository.LedgerEntryRepository;import org.springframework.http.ResponseEntity;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/ledger/history")
public class LedgerHistoryController {
 private final LedgerEntryRepository repository;public LedgerHistoryController(LedgerEntryRepository r){repository=r;}
 @GetMapping("/{account}") public ResponseEntity<?> history(@PathVariable String account){return ResponseEntity.ok(repository.findByAccountNumberOrderByCreatedAtDesc(account));}
}
