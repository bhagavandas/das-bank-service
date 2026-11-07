package com.bank.fraud.service;
import com.bank.fraud.dto.*;import com.bank.fraud.entity.FraudCheck;import com.bank.fraud.repository.FraudCheckRepository;
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;import java.math.BigDecimal;
@Service public class FraudDetectionService {
 private final FraudCheckRepository repository;public FraudDetectionService(FraudCheckRepository r){repository=r;}
 @Transactional public FraudCheckResponse check(FraudCheckRequest r){
  if(repository.existsByTransactionReference(r.getTransactionReference()))throw new IllegalArgumentException("Fraud check already exists for transaction");
  BigDecimal score=BigDecimal.ZERO;String level="LOW",reason="Transaction passed basic rule checks";boolean approved=true;
  if(r.getSourceAccount().equals(r.getDestinationAccount())){score=new BigDecimal("100");level="HIGH";reason="Source and destination accounts are identical";approved=false;}
  else if(r.getAmount().compareTo(new BigDecimal("500000"))>=0){score=new BigDecimal("90");level="HIGH";reason="Amount exceeds high-risk threshold";approved=false;}
  else if(r.getAmount().compareTo(new BigDecimal("100000"))>=0){score=new BigDecimal("60");level="MEDIUM";reason="Large transfer requires manual review";approved=false;}
  else if(r.getAmount().compareTo(new BigDecimal("50000"))>=0){score=new BigDecimal("30");reason="Transfer flagged for standard monitoring";}
  FraudCheck f=new FraudCheck();f.setTransactionReference(r.getTransactionReference());f.setSourceAccount(r.getSourceAccount());f.setDestinationAccount(r.getDestinationAccount());f.setAmount(r.getAmount());f.setApproved(approved);f.setRiskLevel(level);f.setRiskScore(score);f.setReason(reason);repository.save(f);
  return new FraudCheckResponse(r.getTransactionReference(),approved,level,score,reason);
 }
}
