package com.bank.transfer.service;
import com.bank.transfer.dto.*;import org.springframework.beans.factory.annotation.Qualifier;import org.springframework.stereotype.Service;import org.springframework.web.client.RestClient;
@Service public class FraudServiceClient {
 private final RestClient client;public FraudServiceClient(@Qualifier("fraudClient") RestClient c){client=c;}
 public FraudCheckResponse check(FraudCheckRequest r){return client.post().uri("/api/fraud/check").body(r).retrieve().body(FraudCheckResponse.class);}
}
