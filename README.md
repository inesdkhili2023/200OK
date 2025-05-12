# 🛡️ Insurance Management System – Face Recognition & ML Integration

## 📌 Overview

This project is a **full-stack insurance management platform** developed using **Spring Boot** (backend) and **Angular** (frontend), with secure **JWT-based authentication** and integrated **machine learning** for predicting insurance premiums. It also includes **facial recognition features** for login and detection, making user access more seamless and secure.

---

## 🚀 Key Functionalities

### 🔐 Authentication & Security
- **JWT Authentication**: Secure login and role-based access using JSON Web Tokens.
- **Email Verification**: Upon successful signup, users receive a verification email to confirm their registration.
- **Password Reset**: Users can request a password reset via email with a secure tokenized link.

### 🧠 Machine Learning Integration
- **Insurance Premium Prediction**: 
  - A trained ML model (e.g., XGBoost or Decision Tree) predicts insurance premiums based on user demographic and behavioral data.
  - The model is deployed via a Flask API and connected to the frontend for real-time prediction.
  - Features include: Age, Salary, Number of Children, Claims Rate, Loyalty Years, etc.

### 🧍‍♂️ Facial Recognition Features
- **Face Detection Before Signup**: A real-time facial detection system ensures only real users proceed to registration.
- **Face-Based Login**: Users can authenticate using their face via webcam or uploaded image using OpenCV.
- **Secure Embedding Matching**: Facial embeddings are stored and verified against new login inputs.

---

## 🛠️ Technologies Used

### Backend:
- **Spring Boot** (Java)
- **Spring Security** with JWT
- **MySQL** database
- **JavaMailSender** for email verification and password reset
- **OpenCV** (Java wrapper) for face detection/recognition
- **Flask API** for ML prediction

### Frontend:
- **Angular** with Reactive Forms
- **Face-api.js** for real-time face detection
- **Toastr** and **Material UI** for user feedback
- **Chart.js** for visualizing user predictions and stats

---

## 📈 ML Model Details

- Built using Python (Jupyter Notebook)
- Algorithm: **XGBoost** (with tuning via `RandomizedSearchCV`)
- Target Variable: **Premium Work (PremWork)**
- Deployment: Model exported as `.pkl` and integrated via REST API

---

## 🔗 API Endpoints (Sample)

| Method | Endpoint               | Description                        |
|--------|------------------------|------------------------------------|
| POST   | `/auth/signup`         | Register a new user                |
| POST   | `/auth/login`          | Authenticate and return JWT token |
| POST   | `/auth/reset-password` | Send password reset link           |
| POST   | `/auth/predict`        | Get insurance premium prediction   |
| POST   | `/auth/face-login`     | Authenticate using face image      |

---



