package com.bank.beneficiary.repository;
import com.bank.beneficiary.entity.Beneficiary;import org.springframework.data.jpa.repository.JpaRepository;import java.util.*;
public interface BeneficiaryRepository extends JpaRepository<Beneficiary,Long>{
 List<Beneficiary> findByCustomerId(String customerId);Optional<Beneficiary> findByIdAndCustomerId(Long id,String customerId);
 boolean existsByCustomerIdAndBeneficiaryAccount(String customerId,String account);
}
