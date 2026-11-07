package com.bank.transfer.repository;
import com.bank.transfer.entity.TransferTransaction;import org.springframework.data.jpa.repository.JpaRepository;import java.util.Optional;
public interface TransferTransactionRepository extends JpaRepository<TransferTransaction,Long>{
 Optional<TransferTransaction> findByTransactionReference(String ref);
}
