package com.bank.transfer.entity;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity @Table(name="transfers")
public class TransferTransaction {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String transactionReference;
 @Column(nullable=false) private String sourceAccount;@Column(nullable=false) private String destinationAccount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal amount;private String currency;private String status;private String failureReason;private LocalDateTime createdAt;private LocalDateTime updatedAt;
 @PrePersist void create(){createdAt=LocalDateTime.now();updatedAt=createdAt;}@PreUpdate void update(){updatedAt=LocalDateTime.now();}
 public Long getId(){return id;}public String getTransactionReference(){return transactionReference;}public void setTransactionReference(String v){transactionReference=v;}
 public String getSourceAccount(){return sourceAccount;}public void setSourceAccount(String v){sourceAccount=v;}
 public String getDestinationAccount(){return destinationAccount;}public void setDestinationAccount(String v){destinationAccount=v;}
 public BigDecimal getAmount(){return amount;}public void setAmount(BigDecimal v){amount=v;}
 public String getCurrency(){return currency;}public void setCurrency(String v){currency=v;}
 public String getStatus(){return status;}public void setStatus(String v){status=v;}
 public String getFailureReason(){return failureReason;}public void setFailureReason(String v){failureReason=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}public LocalDateTime getUpdatedAt(){return updatedAt;}
}
