package com.bank.beneficiary.security;
import jakarta.servlet.*;import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;import java.util.List;
@Component
public class JwtFilter extends OncePerRequestFilter {
  private final JwtSupport jwt; public JwtFilter(JwtSupport j){jwt=j;}
  @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException {
    String h=req.getHeader("Authorization");
    if(h!=null&&h.startsWith("Bearer ")) try {
      String sub=jwt.subject(h.substring(7));
      if(sub!=null&&!sub.isBlank()) SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(sub,null,List.of()));
    } catch(Exception ex) { res.setStatus(401); return; }
    chain.doFilter(req,res);
  }
}
