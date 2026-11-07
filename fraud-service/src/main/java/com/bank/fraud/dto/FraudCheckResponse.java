package com.bank.fraud.dto;
import java.math.BigDecimal;
public class FraudCheckResponse {
 private String transactionReference;private boolean approved;private String riskLevel;private BigDecimal riskScore;private String reason;
 public FraudCheckResponse(String t,boolean a,String l,BigDecimal s,String r){transactionReference=t;approved=a;riskLevel=l;riskScore=s;reason=r;}
 public String getTransactionReference(){return transactionReference;}public boolean isApproved(){return approved;}
 public String getRiskLevel(){return riskLevel;}public BigDecimal getRiskScore(){return riskScore;}public String getReason(){return reason;}
}
