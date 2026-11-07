package com.bank.ledger.service;
import com.bank.ledger.dto.*;import com.bank.ledger.entity.*;import com.bank.ledger.repository.*;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.util.UUID;import java.util.List;
@Service public class AccountService {
 private final AccountRepository accounts;private final LedgerEntryRepository entries;
 public AccountService(AccountRepository a,LedgerEntryRepository e){accounts=a;entries=e;}
 @Transactional public Account create(CreateAccountRequest r){
  if(accounts.existsByAccountNumber(r.getAccountNumber()))throw new IllegalArgumentException("Account already exists");
  Account a=new Account();a.setAccountNumber(r.getAccountNumber());a.setCustomerId(r.getCustomerId());a.setBalance(r.getInitialBalance());a.setCurrency(r.getCurrency());accounts.save(a);
  LedgerEntry e=new LedgerEntry();e.setTransactionReference("OPEN-"+UUID.randomUUID());e.setAccountNumber(a.getAccountNumber());e.setEntryType("CREDIT");e.setAmount(r.getInitialBalance());e.setBalanceAfter(r.getInitialBalance());entries.save(e);return a;
 }
 public Account get(String n){return accounts.findByAccountNumber(n).orElseThrow(()->new IllegalArgumentException("Account not found"));}
 public List<Account> listByCustomer(String c){return accounts.findByCustomerId(c);}
}
