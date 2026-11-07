package com.bank.transfer.dto;
import java.math.BigDecimal;
public class LedgerOperationRequest {
 private String transactionReference,accountNumber,entryType;private BigDecimal amount;
 public LedgerOperationRequest(String t,String a,BigDecimal m,String e){transactionReference=t;accountNumber=a;amount=m;entryType=e;}
 public String getTransactionReference(){return transactionReference;}public String getAccountNumber(){return accountNumber;}
 public BigDecimal getAmount(){return amount;}public String getEntryType(){return entryType;}
}
