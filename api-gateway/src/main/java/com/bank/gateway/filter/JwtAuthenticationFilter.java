package com.bank.gateway.filter;
import io.jsonwebtoken.Jwts;import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;import org.springframework.cloud.gateway.filter.*;
import org.springframework.core.Ordered;import org.springframework.http.*;import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;import reactor.core.publisher.Mono;
import javax.crypto.SecretKey;import java.nio.charset.StandardCharsets;
@Component public class JwtAuthenticationFilter implements GlobalFilter,Ordered {
 private final SecretKey key;
 public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret){key=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));}
 @Override public Mono<Void> filter(ServerWebExchange ex,GatewayFilterChain chain){
  if(HttpMethod.OPTIONS.equals(ex.getRequest().getMethod()))return chain.filter(ex);
  String path=ex.getRequest().getURI().getPath();
  if(path.startsWith("/api/auth/")||path.equals("/actuator/health"))return chain.filter(ex);
  String h=ex.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
  if(h==null||!h.startsWith("Bearer "))return deny(ex);
  try{
   String sub=Jwts.parser().verifyWith(key).build().parseSignedClaims(h.substring(7)).getPayload().getSubject();
   if(sub==null||sub.isBlank())return deny(ex);
   return chain.filter(ex);
  }catch(Exception e){return deny(ex);}
 }
 private Mono<Void> deny(ServerWebExchange ex){ex.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);return ex.getResponse().setComplete();}
 @Override public int getOrder(){return -1;}
}
