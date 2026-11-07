package com.bank.transfer.dto;
import jakarta.validation.constraints.*;import java.math.BigDecimal;
public class TransferRequest {
 @NotBlank private String sourceAccount;@NotBlank private String destinationAccount;@NotNull @DecimalMin("0.01") private BigDecimal amount;@NotBlank private String currency="INR";
 public String getSourceAccount(){return sourceAccount;}public void setSourceAccount(String v){sourceAccount=v;}
 public String getDestinationAccount(){return destinationAccount;}public void setDestinationAccount(String v){destinationAccount=v;}
 public BigDecimal getAmount(){return amount;}public void setAmount(BigDecimal v){amount=v;}
 public String getCurrency(){return currency;}public void setCurrency(String v){currency=v;}
}
