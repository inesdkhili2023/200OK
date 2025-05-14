# Towing Request Management

The `virginalaa` branch focuses on implementing and managing a *Towing Request Management System*. It includes comprehensive features for handling towing service requests, real-time notifications, and interactive map-based functionalities.

---

## 📖 Overview

The Towing Request Management System ensures efficient operations for towing services by leveraging tools such as WebSockets, real-time notifications, geolocation-based features, towing agent management, and a recommendation system.

### Key Features

- **Request Creation and Tracking**: Create and monitor towing requests in real-time.
- **WebSocket Integration**: Enables live updates for notifications and agent status.
- **Interactive Map**: Displays agent locations, towing requests, and user geolocations using Leaflet.js.
- **Notification System**: Real-time alerts for new towing requests, status updates, and user interactions.
- **Towing Agent Module**: Manage agent details, locations, and assignments.
- **Recommendation Module**: Provide recommendations based on historical data and user feedback.
- **Admin Tools**: Manage users, towing requests, and notifications centrally.

---

## 🌐 API Endpoints

### **Towing Requests**
- **`GET /api/towing-requests`**  
  Fetch all towing requests with filters (e.g., status, date range).
- **`POST /api/towing-requests`**  
  Create a new towing request with required details such as location and vehicle type.
- **`GET /api/towing-requests/{id}`**  
  Retrieve detailed information about a specific towing request.
- **`PUT /api/towing-requests/{id}`**  
  Update an existing towing request (e.g., status, details).
- **`DELETE /api/towing-requests/{id}`**  
  Delete a towing request by its ID.

### **Towing Agent Module**
- **`GET /api/agents`**  
  Retrieve a list of all towing agents.
- **`POST /api/agents`**  
  Add a new towing agent.
- **`GET /api/agents/{id}`**  
  Fetch details of a specific agent.
- **`PUT /api/agents/{id}`**  
  Update agent information (e.g., location, status).
- **`DELETE /api/agents/{id}`**  
  Remove an agent from the system.

### **Recommendation Module**
- **`GET /api/recommendations`**  
  Retrieve recommendations for improving service quality.
- **`POST /api/recommendations`**  
  Submit feedback or data to enhance recommendations.

### **WebSocket Endpoints**
- **`/topic/public`**  
  Subscribe to public updates for all users.
- **`/topic/agent-{id}`**  
  Agent-specific updates for towing requests.
- **`/topic/towing`**  
  Real-time updates for towing service-related changes.

### **Notification API**
- **`GET /api/notifications`**  
  Fetch all notifications for a user.
- **`POST /api/notifications/{id}/read`**  
  Mark a notification as read.
- **`POST /api/notifications/mark-all-read`**  
  Mark all notifications as read.
- **`GET /api/notifications/all`**  
  Retrieve all notifications regardless of agent.

### **Map Integration**
- **Interactive Map Features**  
  - Displays user's current location.
  - Shows nearby agents and towing services with markers.
  - Provides detailed information via popups for each location.

---

## 🛠️ WebSocket Implementation

The application integrates WebSocket services to enhance real-time communication. Below are some details about the implementation:

- **Initialization**: WebSocket connections are established using SockJS and Stomp.js.
- **Subscription Management**: Users subscribe to specific topics based on their roles (e.g., agent updates, towing notifications).
- **Message Handling**: Messages are parsed and displayed in real-time via Angular services.
- **Error Handling**: Automatic reconnection attempts in case of WebSocket errors.

Key methods in the `WebSocketService`:
- **`connect(agentId: number)`**: Connects an agent to their specific WebSocket channel.
- **`sendMessage(destination: string, body: any)`**: Sends a message to a specific WebSocket endpoint.
- **`disconnect()`**: Gracefully disconnects from the WebSocket.

---

## 🗺️ Map and Notification Features

### Map Integration
- **Framework**: Leaflet.js is used for rendering interactive maps.
- **Geolocation**: Displays the user’s current location and nearby agents or towing requests.
- **Markers and Popups**:
  - Agents and towing requests are represented as markers.
  - Popups display detailed information such as agency name, contact details, and status.

### Notifications
- **Real-Time Updates**: Notifications are pushed via WebSocket to inform users about new requests and updates.
- **UI Features**: 
  - Unread notifications are highlighted.
  - Users can mark notifications as read or clear them all.
- **APIs**: Notifications are loaded and managed through REST APIs for reliability.

---

## 📝 Summary of Work Done

1. **Towing Request Management**  
   - API endpoints for creating, updating, and retrieving towing requests.
   - Admin dashboard for managing requests.

2. **WebSocket Integration**  
   - Real-time communication for notifications and towing updates.
   - Modular WebSocket services with reconnection logic.

3. **Map Features**  
   - Display of agents, towing requests, and user location on an interactive map.
   - Integration of QR codes for agency details.

4. **Notification System**  
   - Real-time notification updates using WebSocket and REST APIs.
   - Enhanced UI for managing notifications.

5. **Towing Agent Module**  
   - Manage agent details, locations, and assignments.
   - Enable agents to receive real-time updates on towing requests.

6. **Recommendation Module**  
   - Generate recommendations based on historical data and feedback.
   - Provide actionable insights to improve service efficiency.

7. **Error Handling and Fallbacks**  
   - Graceful handling of WebSocket errors with fallback mechanisms.
   - Mock data support for testing purposes.

---

## 📚 Resources and Support

- **Angular CLI**: See the [Angular CLI Documentation](https://angular.io/cli) for help with Angular commands.
- **Leaflet.js**: Learn more about [Leaflet.js](https://leafletjs.com/) for interactive maps.
- **Contributions**: Feel free to submit issues or pull requests for bugs and new features.

---

Happy coding! 🚀
