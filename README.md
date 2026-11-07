# Interbank Fund Transfer System — Complete Learning Implementation

A runnable Java 17 / Spring Boot 3.3.5 microservices project with MySQL, Kafka, JWT authentication, API Gateway, ledger operations, fraud checks, beneficiaries, and transfer orchestration.

## Services and ports
- Frontend (React): 3000
- API Gateway: 9080
- Auth: 9081
- Ledger: 9082
- Transfer: 9083
- Notification: 9084
- Beneficiary: 9085
- Fraud: 9086
- MySQL: 3306
- Kafka: 9092

## Run with Docker
1. Install Docker Desktop / Docker Engine with Compose.
2. From this directory run: `docker compose up --build`
3. Open `http://localhost:3000` for the React Banking UI or `http://localhost:9080/actuator/health` for the API Gateway.

## Run Frontend Standalone (Development Mode)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

## API flow (Postman or curl)
Register:
`POST http://localhost:9080/api/auth/register`
```json
{"username":"customer1","password":"Password@123"}
```
Login:
`POST http://localhost:9080/api/auth/login`
```json
{"username":"customer1","password":"Password@123"}
```
Copy the `token` from the response and send it as `Authorization: Bearer <token>`.

Create accounts:
`POST http://localhost:9080/api/accounts`
```json
{"accountNumber":"ACC1001","customerId":"customer1","initialBalance":100000,"currency":"INR"}
```
Create another account with a different account number, then transfer:
`POST http://localhost:9080/api/transfers`
```json
{"sourceAccount":"ACC1001","destinationAccount":"ACC2001","amount":5000,"currency":"INR"}
```
Check transfer:
`GET http://localhost:9080/api/transfers/{transactionReference}`
Check balance:
`GET http://localhost:9080/api/accounts/ACC1001/balance`

Beneficiary:
`POST /api/beneficiaries`
```json
{"customerId":"customer1","beneficiaryName":"Test User","beneficiaryAccount":"ACC2001","bankName":"Demo Bank","ifscCode":"DEMO0001234"}
```

## Direct service URLs
When running locally without Docker, use the ports above. Start MySQL and Kafka separately and configure service URLs in each `application.properties`.

## Important engineering limitations
This is a complete runnable learning implementation of the described service flow, **not a production-ready banking platform**. The transfer orchestrator uses a synchronous saga-like sequence with compensating credit after a confirmed debit and marks uncertain outcomes `REQUIRES_RECONCILIATION`. Distributed failure windows still require a durable saga state machine, idempotency keys, outbox/inbox processing, reconciliation jobs and operational review. The demo uses shared symmetric JWT signing secret and simple customer/account identifiers. Production requires secret management, issuer/audience validation, account ownership and role authorization, maker-checker controls, AML/KYC controls, TLS, rate limiting, audit immutability, observability, backups, and security review.

Never use the included demo credentials/secrets for real financial data.
