package com.bank.beneficiary.service;
import com.bank.beneficiary.dto.*;import com.bank.beneficiary.entity.Beneficiary;import com.bank.beneficiary.repository.BeneficiaryRepository;
import org.springframework.stereotype.Service;import java.util.List;
@Service public class BeneficiaryService {
 private final BeneficiaryRepository repo;public BeneficiaryService(BeneficiaryRepository r){repo=r;}
 public Beneficiary add(BeneficiaryRequest r){
  if(repo.existsByCustomerIdAndBeneficiaryAccount(r.getCustomerId(),r.getBeneficiaryAccount()))throw new IllegalArgumentException("Beneficiary already exists");
  Beneficiary b=new Beneficiary();b.setCustomerId(r.getCustomerId());b.setBeneficiaryName(r.getBeneficiaryName());b.setBeneficiaryAccount(r.getBeneficiaryAccount());b.setBankName(r.getBankName());b.setIfscCode(r.getIfscCode());return repo.save(b);
 }
 public List<Beneficiary> list(String customer){return repo.findByCustomerId(customer);}
 public void delete(Long id,String customer){Beneficiary b=repo.findByIdAndCustomerId(id,customer).orElseThrow(()->new IllegalArgumentException("Beneficiary not found"));repo.delete(b);}
}
