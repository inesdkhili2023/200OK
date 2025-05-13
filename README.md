# 🌐 Overview

The Maghrebia website revamp project aims to enhance user experience and streamline online insurance services. The project focuses on two key modules: **Insurance Management** and **Sinister Management**.

## 🚀 Core Features

### 🛡️ Insurance Management

* ✅ Admin can **add, update, and delete** insurance policies.
* 👤 Clients can **view their insurance policies**.
* 📊 Admin can **predict the total claim amount** using statistical calculations.

### ⚡ Sinister Management

* 📝 Clients can **add and update sinister records** with supporting documents.
* 📂 Admin can **review sinister claims**, calculate compensation using a simulator, and update the claim status.
* 📧 Admin **notifies clients via email** using Outlook integration about claim status updates.

## 🛠️ Technologies

* **Spring Boot:** Backend service development.
* **REST API (JSON):** Data exchange format.
* **JPA:** Database management and queries.
* **MySQL:** Data storage.
* **Multipart File Upload:** For document attachments in sinister claims.
* **Angular:** Frontend integration.

## 👤 Roles

* Implementation of **Insurance Management** for policy CRUD operations and predictions.
* **Sinister Management** module development, including document upload, compensation calculation, and email notifications.

## 📦 Notes (File Upload)

* Sinister supporting documents are handled via **Multipart file upload**, allowing clients to attach necessary documentation for claims.

## 📅 Endpoints

| Module    | Method | Endpoint                              | Description                                |
| --------- | ------ | ------------------------------------- | ------------------------------------------ |
| Insurance | GET    | /api/insurances                       | Retrieve all insurance policies            |
| Insurance | POST   | /api/insurances                       | Add a new insurance policy                 |
| Insurance | PUT    | /api/insurances/{id}                  | Update an existing insurance policy        |
| Insurance | DELETE | /api/insurances/{id}                  | Delete an insurance policy                 |
| Insurance | GET    | /api/insurances/predict-claims        | Predict total claim amount                 |
| Sinister  | GET    | /api/sinisters                        | Retrieve all sinisters                     |
| Sinister  | POST   | /api/sinisters                        | Add a new sinister with document upload    |
| Sinister  | PUT    | /api/sinisters/{id}                   | Update an existing sinister                |
| Sinister  | GET    | /api/sinisters/{id}                   | Retrieve a specific sinister by ID         |
| Sinister  | POST   | /api/sinisters/calculate-compensation | Calculate compensation using the simulator |
| Sinister  | POST   | /api/sinisters/{id}/notify            | Send email notification via Outlook        |

## 📄 License

Part of the Assurances Maghrebia Redesign Project – PIDEV Module
For academic use only.
