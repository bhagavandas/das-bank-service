package com.bank.ledger.repository;
import com.bank.ledger.entity.Account;import org.springframework.data.jpa.repository.*;import jakarta.persistence.LockModeType;import java.util.Optional;import java.util.List;
public interface AccountRepository extends JpaRepository<Account,Long>{
 Optional<Account> findByAccountNumber(String n);boolean existsByAccountNumber(String n);
 List<Account> findByCustomerId(String customerId);
 @Lock(LockModeType.PESSIMISTIC_WRITE) @Query("select a from Account a where a.accountNumber=:n") Optional<Account> lockByNumber(String n);
}
