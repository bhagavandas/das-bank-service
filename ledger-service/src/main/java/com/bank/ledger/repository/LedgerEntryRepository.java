package com.bank.ledger.repository;
import com.bank.ledger.entity.LedgerEntry;import org.springframework.data.jpa.repository.JpaRepository;import java.util.*;
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry,Long>{
 boolean existsByTransactionReferenceAndAccountNumberAndEntryType(String ref,String account,String type);
 List<LedgerEntry> findByAccountNumberOrderByCreatedAtDesc(String account);
}
