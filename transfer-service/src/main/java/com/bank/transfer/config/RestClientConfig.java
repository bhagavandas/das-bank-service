package com.bank.transfer.config;
import org.springframework.beans.factory.annotation.Value;import org.springframework.context.annotation.*;import org.springframework.web.client.RestClient;
@Configuration public class RestClientConfig {
 @Bean(name="ledgerClient") RestClient ledger(@Value("${ledger-service.url}") String u){return RestClient.builder().baseUrl(u).build();}
 @Bean(name="fraudClient") RestClient fraud(@Value("${fraud-service.url}") String u){return RestClient.builder().baseUrl(u).build();}
}
