package com.bank.auth.exception;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestControllerAdvice
public class AuthExceptionHandler {
 @ExceptionHandler(IllegalArgumentException.class) public ResponseEntity<?> bad(IllegalArgumentException e){return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<?> validation(MethodArgumentNotValidException e){
  Map<String,String> m=new HashMap<>();e.getBindingResult().getFieldErrors().forEach(x->m.put(x.getField(),x.getDefaultMessage()));return ResponseEntity.badRequest().body(m);
 }
}
