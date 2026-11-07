package com.bank.fraud.entity;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity @Table(name="fraud_checks")
public class FraudCheck {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String transactionReference;private String sourceAccount;private String destinationAccount;
 @Column(precision=19,scale=2) private BigDecimal amount;private boolean approved;private String riskLevel;
 @Column(precision=5,scale=2) private BigDecimal riskScore;private String reason;private LocalDateTime createdAt;
 @PrePersist void created(){createdAt=LocalDateTime.now();}
 public void setTransactionReference(String v){transactionReference=v;}public void setSourceAccount(String v){sourceAccount=v;}
 public void setDestinationAccount(String v){destinationAccount=v;}public void setAmount(BigDecimal v){amount=v;}
 public void setApproved(boolean v){approved=v;}public void setRiskLevel(String v){riskLevel=v;}
 public void setRiskScore(BigDecimal v){riskScore=v;}public void setReason(String v){reason=v;}
}
