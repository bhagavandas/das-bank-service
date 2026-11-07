package com.bank.beneficiary.entity;
import jakarta.persistence.*;import java.time.LocalDateTime;
@Entity @Table(name="beneficiaries",uniqueConstraints=@UniqueConstraint(columnNames={"customerId","beneficiaryAccount"}))
public class Beneficiary {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(nullable=false) private String customerId;@Column(nullable=false) private String beneficiaryName;
 @Column(nullable=false) private String beneficiaryAccount;private String bankName;private String ifscCode;private String status="PENDING";private LocalDateTime createdAt;
 @PrePersist void created(){createdAt=LocalDateTime.now();}
 public Long getId(){return id;}public String getCustomerId(){return customerId;}public void setCustomerId(String v){customerId=v;}
 public String getBeneficiaryName(){return beneficiaryName;}public void setBeneficiaryName(String v){beneficiaryName=v;}
 public String getBeneficiaryAccount(){return beneficiaryAccount;}public void setBeneficiaryAccount(String v){beneficiaryAccount=v;}
 public String getBankName(){return bankName;}public void setBankName(String v){bankName=v;}
 public String getIfscCode(){return ifscCode;}public void setIfscCode(String v){ifscCode=v;}
 public String getStatus(){return status;}public void setStatus(String v){status=v;}public LocalDateTime getCreatedAt(){return createdAt;}
}
