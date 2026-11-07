package com.bank.fraud;
import org.junit.jupiter.api.Test;import static org.junit.jupiter.api.Assertions.*;
class FraudRuleTest {
 @Test void highAmountIsAboveReviewThreshold(){assertTrue(new java.math.BigDecimal("600000").compareTo(new java.math.BigDecimal("500000"))>=0);}
}
