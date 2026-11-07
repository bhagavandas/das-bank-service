# NovaBank — Modern React Frontend

A modern React 18 + Vite frontend for the Interbank Fund Transfer & Saga Banking microservices system.

## Features

- **JWT Authentication**: Register, login, and bearer token session management.
- **Account Management**: View bank accounts, live balances, and open new accounts with initial deposits.
- **Interbank Transfer Flow**: Source account selection, beneficiary picker or manual account entry, real-time fraud risk indicators, and transfer execution.
- **Beneficiary Directory**: Save, manage, and one-click transfer to favorite recipient payees.
- **Ledger Audit & History**: Chronological view of double-entry ledger records (credits & debits) with running balance after each transaction.
- **Transfer Saga Tracker**: Real-time status lookup and visual saga progression (Fraud Check → Ledger Debit → Ledger Credit → Kafka Event).
- **Backend Health Ping**: Real-time connectivity check with the API Gateway (`:9080`).

## Connected Services

- **API Gateway**: `http://localhost:9080` (CORS enabled & proxied)
- **Auth Service**: `http://localhost:9081` (`/api/auth/**`)
- **Ledger Service**: `http://localhost:9082` (`/api/accounts/**`, `/api/ledger/**`)
- **Transfer Service**: `http://localhost:9083` (`/api/transfers/**`)
- **Beneficiary Service**: `http://localhost:9085` (`/api/beneficiaries/**`)
- **Fraud Service**: `http://localhost:9086` (`/api/fraud/**`)
- **Notification Service**: `http://localhost:9084` (`/api/notifications/**`)

## Getting Started

### Option 1: Run with Docker Compose (Full Stack)
From project root (`d:\Bank-Service`):
```bash
docker compose up --build
```
Then visit:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **API Gateway Health**: [http://localhost:9080/actuator/health](http://localhost:9080/actuator/health)

### Option 2: Run Frontend Standalone (Development Mode)
From `frontend` directory:
```bash
cd frontend
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
Vite proxies `/api/*` requests directly to `http://localhost:9080` to prevent browser CORS issues.

## Test Credentials
- **Username**: `customer1`
- **Password**: `Password@123`
*(Or register a new account on the portal login page)*

