package com.bank.fraud.repository;
import com.bank.fraud.entity.FraudCheck;import org.springframework.data.jpa.repository.JpaRepository;import java.util.Optional;
public interface FraudCheckRepository extends JpaRepository<FraudCheck,Long>{
 boolean existsByTransactionReference(String ref);Optional<FraudCheck> findByTransactionReference(String ref);
}
