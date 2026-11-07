package com.bank.transfer.event;
import java.math.BigDecimal;
public class TransferCompletedEvent {
 private String transactionReference,sourceAccount,destinationAccount,status;private BigDecimal amount;private String currency;
 public TransferCompletedEvent(String r,String s,String d,BigDecimal a,String c,String st){transactionReference=r;sourceAccount=s;destinationAccount=d;amount=a;currency=c;status=st;}
 public String getTransactionReference(){return transactionReference;}public String getSourceAccount(){return sourceAccount;}
 public String getDestinationAccount(){return destinationAccount;}public BigDecimal getAmount(){return amount;}
 public String getCurrency(){return currency;}public String getStatus(){return status;}
}
