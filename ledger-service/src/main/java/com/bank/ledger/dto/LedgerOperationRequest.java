package com.bank.ledger.dto;
import jakarta.validation.constraints.*;import java.math.BigDecimal;
public class LedgerOperationRequest {
 @NotBlank private String transactionReference;@NotBlank private String accountNumber;@NotNull @DecimalMin("0.01") private BigDecimal amount;@NotBlank private String entryType;
 public String getTransactionReference(){return transactionReference;}public void setTransactionReference(String v){transactionReference=v;}
 public String getAccountNumber(){return accountNumber;}public void setAccountNumber(String v){accountNumber=v;}
 public BigDecimal getAmount(){return amount;}public void setAmount(BigDecimal v){amount=v;}
 public String getEntryType(){return entryType;}public void setEntryType(String v){entryType=v;}
}
