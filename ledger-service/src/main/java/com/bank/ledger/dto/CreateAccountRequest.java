package com.bank.ledger.dto;
import jakarta.validation.constraints.*;import java.math.BigDecimal;
public class CreateAccountRequest {
 @NotBlank private String accountNumber;@NotBlank private String customerId;@NotNull @DecimalMin("0.00") private BigDecimal initialBalance;@NotBlank private String currency="INR";
 public String getAccountNumber(){return accountNumber;}public void setAccountNumber(String v){accountNumber=v;}
 public String getCustomerId(){return customerId;}public void setCustomerId(String v){customerId=v;}
 public BigDecimal getInitialBalance(){return initialBalance;}public void setInitialBalance(BigDecimal v){initialBalance=v;}
 public String getCurrency(){return currency;}public void setCurrency(String v){currency=v;}
}
