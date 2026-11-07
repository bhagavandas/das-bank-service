package com.bank.ledger.entity;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity @Table(name="ledger_entries",indexes=@Index(columnList="transactionReference,accountNumber"))
public class LedgerEntry {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String transactionReference;@Column(nullable=false) private String accountNumber;
 @Column(nullable=false) private String entryType;@Column(nullable=false,precision=19,scale=2) private BigDecimal amount;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal balanceAfter;private LocalDateTime createdAt;
 @PrePersist void onCreate(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getTransactionReference(){return transactionReference;} public void setTransactionReference(String v){transactionReference=v;}
 public String getAccountNumber(){return accountNumber;} public void setAccountNumber(String v){accountNumber=v;}
 public String getEntryType(){return entryType;} public void setEntryType(String v){entryType=v;}
 public BigDecimal getAmount(){return amount;} public void setAmount(BigDecimal v){amount=v;}
 public BigDecimal getBalanceAfter(){return balanceAfter;} public void setBalanceAfter(BigDecimal v){balanceAfter=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
