package com.bank.transfer.service;
import com.bank.transfer.dto.*;import com.bank.transfer.entity.TransferTransaction;import com.bank.transfer.event.TransferCompletedEvent;import com.bank.transfer.repository.TransferTransactionRepository;
import org.springframework.beans.factory.annotation.Qualifier;import org.springframework.kafka.core.KafkaTemplate;import org.springframework.stereotype.Service;import org.springframework.web.client.RestClient;
import java.time.LocalDateTime;import java.util.UUID;
@Service public class TransferService {
 private final TransferTransactionRepository repository;private final RestClient ledger;private final FraudServiceClient fraud;private final KafkaTemplate<String,Object> kafka;
 public TransferService(TransferTransactionRepository r,@Qualifier("ledgerClient") RestClient l,FraudServiceClient f,KafkaTemplate<String,Object> k){repository=r;ledger=l;fraud=f;kafka=k;}
 public TransferResponse initiate(TransferRequest request){
  if(request.getSourceAccount().equals(request.getDestinationAccount()))throw new IllegalArgumentException("Source and destination accounts must differ");
  String ref=UUID.randomUUID().toString();
  FraudCheckResponse risk=fraud.check(new FraudCheckRequest(ref,request.getSourceAccount(),request.getDestinationAccount(),request.getAmount()));
  TransferTransaction t=new TransferTransaction();t.setTransactionReference(ref);t.setSourceAccount(request.getSourceAccount());t.setDestinationAccount(request.getDestinationAccount());t.setAmount(request.getAmount());t.setCurrency(request.getCurrency());
  if(!risk.isApproved()){t.setStatus("REJECTED");t.setFailureReason(risk.getReason());repository.save(t);return new TransferResponse(ref,t.getStatus(),t.getFailureReason());}
  t.setStatus("PROCESSING");repository.save(t);
  boolean debitConfirmed=false;
  try {
   ledger.post().uri("/api/ledger/process").body(new LedgerOperationRequest(ref,request.getSourceAccount(),request.getAmount(),"DEBIT")).retrieve().toBodilessEntity();
   debitConfirmed=true;
   ledger.post().uri("/api/ledger/process").body(new LedgerOperationRequest(ref,request.getDestinationAccount(),request.getAmount(),"CREDIT")).retrieve().toBodilessEntity();
   t.setStatus("SUCCESS");t.setFailureReason(null);
   repository.save(t);
   try { kafka.send("transfer-events",ref,new TransferCompletedEvent(ref,t.getSourceAccount(),t.getDestinationAccount(),t.getAmount(),t.getCurrency(),"SUCCESS")); } catch(Exception ignored) {}
  } catch(Exception ex) {
   if(debitConfirmed) {
    try {
     ledger.post().uri("/api/ledger/process").body(new LedgerOperationRequest(ref+"-COMP",request.getSourceAccount(),request.getAmount(),"CREDIT")).retrieve().toBodilessEntity();
     t.setStatus("COMPENSATED");t.setFailureReason("Destination credit failed; source debit was compensated");
    } catch(Exception compensationFailure) {
     t.setStatus("REQUIRES_RECONCILIATION");t.setFailureReason("Compensation outcome uncertain; manual reconciliation required");
    }
   } else {
    t.setStatus("FAILED");t.setFailureReason("Source debit was not confirmed; inspect ledger before retrying");
   }
  }
  repository.save(t);
  return new TransferResponse(ref,t.getStatus(),t.getFailureReason());
 }
 public TransferTransaction getStatus(String ref){return repository.findByTransactionReference(ref).orElseThrow(()->new IllegalArgumentException("Transfer not found"));}
}
