package com.bank.ledger.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String,String>> validation(MethodArgumentNotValidException ex) {
    Map<String,String> m=new HashMap<>();
    ex.getBindingResult().getFieldErrors().forEach(e->m.put(e.getField(),e.getDefaultMessage()));
    return ResponseEntity.badRequest().body(m);
  }
  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<Map<String,String>> badRequest(IllegalArgumentException ex) {
    return ResponseEntity.badRequest().body(Map.of("error",ex.getMessage()));
  }
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Map<String,String>> internal(Exception ex) {
    return ResponseEntity.status(500).body(Map.of("error","Unexpected server error"));
  }
}
