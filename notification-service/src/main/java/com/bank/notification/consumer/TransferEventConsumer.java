package com.bank.notification.consumer;
import org.springframework.kafka.annotation.KafkaListener;import org.springframework.stereotype.Component;
@Component public class TransferEventConsumer {
 @KafkaListener(topics="transfer-events",groupId="notification-service-group")
 public void consume(String event){System.out.println("Transfer notification event received: "+event);}
}
