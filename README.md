# 📂 Job Offers & Applications Module

## 📝 Overview

This microservice is responsible for managing **job offers** and **candidate applications** within the Maghrebia Insurance platform.

It enables administrators to post, update, or remove job offers, and allows users to browse, view, and apply for jobs directly via the website.

---

## ⚙️ Core Features

- ✅ Create, update, delete job offers (Admin)
- ✅ View all active job offers (Visitors & Authenticated users)
- ✅ Search/filter job offers by title, location, contract type...
- ✅ Submit applications with resume and cover letter upload
- ✅ Handle spontaneous (unsolicited) applications
- ✅ Pre-fill application forms for specific job postings
- ✅ Admin dashboard to view and manage applications and update their status

---

## 🗂️ API Endpoints (Job Service)

| Method | Endpoint                       | Description                            |
|--------|--------------------------------|----------------------------------------|
| POST   | `/api/joboffers/add`                   | Create a new job offer                 |
| GET    | `/api/jobsoffers/getAll`                   | Get all job offers                     |
| GET    | `/api/jobsoffers/{id}`             | Get job offer by ID                    |
| PUT    | `/api/jobsoffers/{id}`             | Update a job offer                     |
| DELETE | `/api/jobsoffers/{id}`             | Delete a job offer                     |

---

## 🗂️ API Endpoints (Application Service)

| Method | Endpoint                             | Description                              |
|--------|--------------------------------------|------------------------------------------|
| POST   | `/api/jobapplications`                 | Submit a job application                 |
| GET    | `/api/jobapplications/job/{jobId}`     | Get applications for a specific job      |

---

# 📅 Appointments & Availabilities Module

## 📝 Overview

This microservice allows **clients** to book **appointments** with insurance agents based on predefined availabilities. It ensures that only valid time slots can be booked and sends SMS notifications upon booking.

---

## ⚙️ Core Features

- ✅ Agents can define their availability (days/times)
- ✅ Clients can view and book available time slots
- ✅ Admins and agents can view all scheduled appointments
- ✅ Prevent double-booking or invalid time slots
- ✅ FullCalendar frontend integration
- ✅ SMS/Email confirmation and reminders via Notification Service

---

## 🗂️ API Endpoints (Availability)

| Method | Endpoint                            | Description                              |
|--------|-------------------------------------|------------------------------------------|
| POST   | `/api/availabilities`              | Create agent availability                |

---

## 🗂️ API Endpoints (Appointments)

| Method | Endpoint                          | Description                            |
|--------|-----------------------------------|----------------------------------------|
| POST   | `/api/appointments`              | Book a new appointment                 |
| PUT    | `/api/appointments/{id}`         | Update appointment details             |
| DELETE | `/api/appointments/{id}`         | Cancel an appointment                  |

---

## 🧱 Technologies

- Spring Boot
- REST API (JSON)
- JPA
- MySQL
- File upload via Multipart
- Angular integration
- FullCalendar JS
- Twilio API (SMS Notifications)

---

## 👤 Roles

- **Administrator**: Manage job offers, view applications, and control appointments.
- **User (Client)**: Apply to jobs, schedule appointments.
- **Agent**: Set availability and manage their appointments.

---


## 📝 Notes

- File uploads (CVs, cover letters) are stored in the server’s file system.
- File metadata (path, name, type) is stored in the DB.

---

## 📄 License

Part of the Assurances Maghrebia Redesign Project – PIDEV Module  
**For academic use only.**
