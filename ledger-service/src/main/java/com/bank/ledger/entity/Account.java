package com.bank.ledger.entity;
import jakarta.persistence.*;import java.math.BigDecimal;import java.time.LocalDateTime;
@Entity @Table(name="accounts")
public class Account {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false,unique=true) private String accountNumber;
 @Column(nullable=false) private String customerId;
 @Column(nullable=false,precision=19,scale=2) private BigDecimal balance;
 @Column(nullable=false) private String currency="INR";
 @Column(nullable=false) private String status="ACTIVE";
 @Version private Long version; private LocalDateTime createdAt;
 @PrePersist void onCreate(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;} public String getAccountNumber(){return accountNumber;} public void setAccountNumber(String v){accountNumber=v;}
 public String getCustomerId(){return customerId;} public void setCustomerId(String v){customerId=v;}
 public BigDecimal getBalance(){return balance;} public void setBalance(BigDecimal v){balance=v;}
 public String getCurrency(){return currency;} public void setCurrency(String v){currency=v;}
 public String getStatus(){return status;} public void setStatus(String v){status=v;}
 public LocalDateTime getCreatedAt(){return createdAt;}
}
