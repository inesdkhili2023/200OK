# 📄 Contract, Invoice, Payment & Quote Management System

This project is part of the **Assurances Maghrebia Redesign – PIDEV Module**. It includes contract, invoice, payment, and quote management functionalities, built using a modern stack with **Spring Boot** and **Angular**.

---

## 🚀 Overview

This backend and frontend solution is designed to automate and secure the management of:
- Contracts and invoices (including PDF generation and QR codes),
- Online payments via Stripe,
- Insurance quote requests with integrated email notifications.

The system is role-based and integrates secure communication between frontend and backend using token-based authorization.

---

## 🧩 Core Features

### ✅ Module 6: Contract and Invoice Management

**Purpose:** Automate retrieval and PDF generation of contracts and invoices with branding and traceability.

#### 📌 Features:
- Generate and download styled PDF documents
- Embed QR codes (optional)
- Token-secured endpoints
- Integration with Angular frontend

#### 📥 API Endpoints:
- `GET /api/contrats` – Retrieve all contracts
- `GET /api/contrats/{id}/pdf` – Generate contract PDF
- `GET /factures` – Retrieve all invoices
- `GET /factures/{id}/pdf` – Generate invoice PDF

---

### 💳 Module 7: Payment Management (Stripe)

**Purpose:** Handle secure Stripe-based card payments and store related data.

#### 📌 Features:
- Secure card transactions via Stripe
- PaymentIntent flow with frontend validation
- Store and manage payment records

#### 📥 API Endpoints:
- `POST /paiements/create` – Log initial payment info
- `POST /paiements/create-payment-intent` – Initialize Stripe PaymentIntent
- `POST /paiements/confirm-and-save` – Confirm and save completed payments

---

### 🧾 Module 8: Quote (Devis) Management

**Purpose:** Allow users to request insurance quotes and receive email confirmations.

#### 📌 Features:
- Create and manage insurance quote requests
- Email notifications (confirmation, validation)
- User association with quotes

#### 📥 API Endpoints:
- `GET /devis/users` – Get users (secured)
- `POST /devis/create` – Create a new quote
- `GET /test-email` – Send a test email
- `GET /factures/users` – Retrieve users linked to invoices

---

## 🖥️ Frontend Integration

- Developed using **Angular**
- Uses reactive forms and RESTful communication
- Secure API interaction using token-based authentication
- In-app PDF viewing and downloads
- Stripe Elements for card inputs

---

## 🛠️ Technologies Used

- **Spring Boot**
- **REST API (JSON)**
- **JPA / Hibernate**
- **MySQL**
- **iText PDF generation**
- **QR Code generation**
- **File upload (Multipart)**
- **Stripe SDK**
- **Angular 15+**

---

## 👥 Roles

- **Admin** – Full access to all features and endpoints
- **User** – Can manage their own contracts, quotes, and payments
- **Guest** – Limited access, mostly read-only or public

---

## 📝 Notes

- All secure endpoints require a valid token in the `Authorization` header.
- Email service uses SMTP; test endpoint available.
- Stripe payments are processed in cents.
- iText is used for consistent branded PDFs (contract & invoice).

---

## 📜 License

This project is part of the **Assurances Maghrebia Redesign Project – PIDEV**  
📚 **For academic use only. Not intended for production deployment.**

---

## 🔗 Project Links

- 🎓 [GitHub Repository](#)  
- 📢 [LinkedIn Project Post](#)

---

