# 📄 Contract, Invoice, Payment, Quote & Chatbot Management System

This project is part of the **Assurances Maghrebia Redesign – PIDEV Module**. It includes contract, invoice, payment, quote, and intelligent chatbot functionalities, built using **Spring Boot**, **Angular**, and **Rasa (AI-powered chatbot framework)**.

---

## 🚀 Overview

This complete solution includes both backend and frontend components designed to manage:
- Business documents (contracts, invoices),
- Insurance quotes and Stripe payments,
- A smart chatbot that assists users via natural language understanding.

The chatbot supports quote submissions, FAQ answers, and redirects to specific services.

---

## 🧩 Core Features

### ✅ Module : Contract and Invoice Management

**Purpose:** Automate retrieval and PDF generation of contracts and invoices with branding and traceability.

#### 📌 Features:
- Generate and download styled PDF documents
- QR code integration
- Token-secured endpoints
- Angular integration for listing and previewing documents

#### 📥 API Endpoints:
- `GET /api/contrats` – Retrieve all contracts
- `GET /api/contrats/{id}/pdf` – Generate contract PDF
- `GET /factures` – Retrieve all invoices
- `GET /factures/{id}/pdf` – Generate invoice PDF

---

### 💳 Module : Payment Management (Stripe)

**Purpose:** Handle secure Stripe-based card payments and store related data.

#### 📌 Features:
- Secure Stripe integration with client-side Elements
- Full payment flow with backend validation
- Payment record persistence

#### 📥 API Endpoints:
- `POST /paiements/create` – Log initial payment info
- `POST /paiements/create-payment-intent` – Initialize Stripe PaymentIntent
- `POST /paiements/confirm-and-save` – Confirm and store payment

---

### 🧾 Module : Quote (Devis) Management

**Purpose:** Enable users to request insurance quotes and receive confirmation emails.

#### 📌 Features:
- Create quotes from Angular forms
- Email notifications on key actions
- Token-based user linking

#### 📥 API Endpoints:
- `POST /devis/create` – Submit a new quote
- `GET /devis/users` – Retrieve users associated with quotes
- `GET /test-email` – Send test email
- `GET /factures/users` – Get users related to invoices

---

### 🤖  AI Chatbot Assistant (Rasa)

**Purpose:** Provide real-time user assistance using a machine learning–based chatbot.

#### 📌 Features:
- Built using **Rasa (NLU + Core)** and trained with real conversation data
- Handles quote requests, payment help, document info, etc.
- Custom fallback, intent classification, and form-based dialogues
- Integrated into the Angular frontend via REST or WebSocket

#### 📥 Chatbot Endpoints:
- `POST /webhooks/rest/webhook` – Rasa endpoint to receive user messages
- `GET /intents` –  Expose available intents for admin use

#### 🧠 Training Details:
- Uses Rasa NLU pipeline with spaCy / DIETClassifier (Deep Learning)
- Domain includes intents like:
  - `request_quote`
  - `invoice_help`
  - `payment_assistance`
  - `greet`, `goodbye`, `faq`, `fallback`
- Stories and rules define conversational paths

---

## 🖥️ Frontend Integration

- Built with **Angular**
- Secure API calls using tokens
- In-app PDF preview and Stripe integration
- Chatbot UI available chat window
- Dynamic responses handled via REST/WebSocket to Rasa

---

## 🛠️ Technologies Used

- **Spring Boot** (Backend)
- **REST API (JSON)**
- **JPA**
- **MySQL**
- **iText PDF Generator**
- **QR Code Generator**
- **Stripe SDK**
- **Angular 16** (Frontend)
- **Rasa Open Source** (Chatbot)
- **Python 3.10** for Rasa backend
- **DIETClassifier** for chatbot training

---

## 👥 Roles

- **Admin** 
- **User** 
- **Guest** 

---

## 📝 Notes

- All protected endpoints require a token in `Authorization` header.
- Stripe handles secure card payments with tokenized flow.


---

## 📜 License

This project is part of the **Assurances Maghrebia Redesign Project – PIDEV**  
📚 **For academic use only. Not for commercial use.**

---

## 🔗 Project Links

- 🎓 [GitHub Repository](#)
- 🧠 [Rasa Bot GitHub ](#)
  

---
