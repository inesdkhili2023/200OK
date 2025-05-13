🚀 200OK Insurance Management Platform
A modular and scalable insurance management system featuring agency operations, claims processing, and customer feedback tools.

📍 Agency Management Module
📝 Overview
Handles all operations related to insurance agency data and location management. Administrators can manage agency records, while users can browse and locate nearby agencies.

⚙️ Core Features
✅ Create, update, and delete agency records (Admin only)

✅ View all active agencies with full details

✅ Interactive map showing agency locations

✅ Search by agency name or location

✅ Display of contact information and business hours

✅ Geolocation-based agency suggestions

📡 API Endpoints
Method	Endpoint	Description
POST	/api/save/Agency	Create a new agency
GET	/api/get/Agency	Retrieve all agencies
GET	/api/get/Agency/{id}	Get agency by ID
PUT	/api/update/Agency	Update agency details
DELETE	/api/delete/Agency/{id}	Delete an agency

📦 Claims Management Module
📝 Overview
Manages the complete lifecycle of insurance claims—from submission to resolution. Supports both authenticated and anonymous claim submissions.

⚙️ Core Features
✅ Submit new claims (with or without login)

✅ Track claim status updates

✅ Admin dashboard for claim review and actions

✅ Multiple claim types supported (e.g., CLAIM, COMPLAINT)

✅ Claim status lifecycle: UNTREATED → IN_PROGRESS → RESOLVED

📡 API Endpoints
Method	Endpoint	Description
POST	/api/save/Claim/{userId}	Submit claim (by user)
POST	/api/save/Claim/anonymous	Submit anonymous claim
GET	/api/get/Claim	Get all claims
GET	/api/get/Claim/{id}	Get claim by ID
PUT	/api/update/Claim	Update a claim
DELETE	/api/delete/Claim/{id}	Delete a claim

⭐ Ratings & Feedback Module
📝 Overview
Allows users to rate their claims experience and submit feedback to help improve service quality.

⚙️ Core Features
✅ Submit ratings for resolved claims

✅ Provide optional detailed feedback

✅ Admin dashboard for viewing ratings and feedback

✅ Aggregate rating statistics and analytics

✅ Report generation for feedback insights

📡 API Endpoints
Method	Endpoint	Description
POST	/api/user/save/rating	Submit a rating
GET	/api/user/get/rating/{claimId}	Get rating for a specific claim

🧰 Technology Stack
Frontend: Angular, Bootstrap, Material UI, Leaflet.js, RxJS

Backend: Spring Boot, RESTful APIs (JSON), JPA/Hibernate

Database: MySQL

Architecture: Microservices (decoupled frontend/backend)

👥 User Roles
Administrator: Full platform access (agencies, claims, ratings)

Authenticated User: Submit/view claims, rate services, view agencies

Anonymous User: Submit claims without login

📌 Additional Notes
Fully modular microservices-based architecture

Geolocation and map-based features are integrated via Leaflet

Feedback and rating system is planned for backend integration

📄 License
© 2023 200OK Insurance Management Platform
This platform is developed for educational and demonstration purposes.
