package com.bank.fraud.dto;
import jakarta.validation.constraints.*;import java.math.BigDecimal;
public class FraudCheckRequest {
 @NotBlank private String transactionReference;@NotBlank private String sourceAccount;@NotBlank private String destinationAccount;@NotNull @DecimalMin("0.01") private BigDecimal amount;
 public String getTransactionReference(){return transactionReference;}public void setTransactionReference(String v){transactionReference=v;}
 public String getSourceAccount(){return sourceAccount;}public void setSourceAccount(String v){sourceAccount=v;}
 public String getDestinationAccount(){return destinationAccount;}public void setDestinationAccount(String v){destinationAccount=v;}
 public BigDecimal getAmount(){return amount;}public void setAmount(BigDecimal v){amount=v;}
}
