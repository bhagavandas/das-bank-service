package com.bank.transfer.dto;
public class FraudCheckResponse {
 private String transactionReference;private boolean approved;private String riskLevel;private String reason;
 public String getTransactionReference(){return transactionReference;}public void setTransactionReference(String v){transactionReference=v;}
 public boolean isApproved(){return approved;}public void setApproved(boolean v){approved=v;}
 public String getRiskLevel(){return riskLevel;}public void setRiskLevel(String v){riskLevel=v;}
 public String getReason(){return reason;}public void setReason(String v){reason=v;}
}
