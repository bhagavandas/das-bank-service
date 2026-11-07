package com.bank.beneficiary.dto;
import jakarta.validation.constraints.NotBlank;
public class BeneficiaryRequest {
 @NotBlank private String customerId;@NotBlank private String beneficiaryName;@NotBlank private String beneficiaryAccount;private String bankName;private String ifscCode;
 public String getCustomerId(){return customerId;}public void setCustomerId(String v){customerId=v;}
 public String getBeneficiaryName(){return beneficiaryName;}public void setBeneficiaryName(String v){beneficiaryName=v;}
 public String getBeneficiaryAccount(){return beneficiaryAccount;}public void setBeneficiaryAccount(String v){beneficiaryAccount=v;}
 public String getBankName(){return bankName;}public void setBankName(String v){bankName=v;}
 public String getIfscCode(){return ifscCode;}public void setIfscCode(String v){ifscCode=v;}
}
