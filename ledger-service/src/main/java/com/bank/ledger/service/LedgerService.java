package com.bank.ledger.service;
import com.bank.ledger.dto.*;import com.bank.ledger.entity.*;import com.bank.ledger.repository.*;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.math.BigDecimal;
@Service public class LedgerService {
 private final AccountRepository accounts;private final LedgerEntryRepository entries;
 public LedgerService(AccountRepository a,LedgerEntryRepository e){accounts=a;entries=e;}
 @Transactional public Account process(LedgerOperationRequest r){
  if(r.getAmount()==null||r.getAmount().signum()<=0)throw new IllegalArgumentException("Amount must be positive");
  String type=r.getEntryType().toUpperCase();
  if(!type.equals("DEBIT")&&!type.equals("CREDIT"))throw new IllegalArgumentException("Entry type must be DEBIT or CREDIT");
  if(entries.existsByTransactionReferenceAndAccountNumberAndEntryType(r.getTransactionReference(),r.getAccountNumber(),type))throw new IllegalArgumentException("Duplicate ledger operation");
  Account a=accounts.lockByNumber(r.getAccountNumber()).orElseThrow(()->new IllegalArgumentException("Account not found"));
  if(!"ACTIVE".equals(a.getStatus()))throw new IllegalArgumentException("Account is not active");
  if(type.equals("DEBIT")){if(a.getBalance().compareTo(r.getAmount())<0)throw new IllegalArgumentException("Insufficient balance");a.setBalance(a.getBalance().subtract(r.getAmount()));}
  else a.setBalance(a.getBalance().add(r.getAmount()));
  accounts.save(a);LedgerEntry e=new LedgerEntry();e.setTransactionReference(r.getTransactionReference());e.setAccountNumber(r.getAccountNumber());e.setEntryType(type);e.setAmount(r.getAmount());e.setBalanceAfter(a.getBalance());entries.save(e);return a;
 }
}
