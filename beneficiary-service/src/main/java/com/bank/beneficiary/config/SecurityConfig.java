package com.bank.beneficiary.config;
import com.bank.beneficiary.security.JwtFilter;
import org.springframework.context.annotation.*;import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration public class SecurityConfig {
  @Bean SecurityFilterChain chain(HttpSecurity http,JwtFilter filter)throws Exception {
   return http.csrf(c->c.disable()).formLogin(f->f.disable()).httpBasic(h->h.disable())
    .sessionManagement(s->s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    .authorizeHttpRequests(a->a.anyRequest().authenticated())
    .addFilterBefore(filter,UsernamePasswordAuthenticationFilter.class).build();
  }
}
