package com.bank.transfer.dto;
import java.math.BigDecimal;
public class FraudCheckRequest {
 private String transactionReference,sourceAccount,destinationAccount;private BigDecimal amount;
 public FraudCheckRequest(String t,String s,String d,BigDecimal a){transactionReference=t;sourceAccount=s;destinationAccount=d;amount=a;}
 public String getTransactionReference(){return transactionReference;}public String getSourceAccount(){return sourceAccount;}
 public String getDestinationAccount(){return destinationAccount;}public BigDecimal getAmount(){return amount;}
}
