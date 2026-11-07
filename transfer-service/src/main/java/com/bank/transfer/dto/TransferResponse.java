package com.bank.transfer.dto;
public class TransferResponse {
 private String transactionReference;private String status;private String message;
 public TransferResponse(String r,String s,String m){transactionReference=r;status=s;message=m;}
 public String getTransactionReference(){return transactionReference;}public String getStatus(){return status;}public String getMessage(){return message;}
}
