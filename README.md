# **Impossible Missions Force: Gadget Ops API**  

Welcome, Agent. This is your official access guide to the **IMF Gadget Operations API**—your mission-critical system for tracking and managing high-tech field gadgets. Stay sharp, follow protocol, and ensure **no unauthorized access**.  

---

## **📜 Mission Briefing: API Access & Deployment**  

🔹 **Intel Files:** [Postman Documentation](https://documenter.getpostman.com/view/41653874/2sAYX3phYR)  
🔹 **Operational Base:** Deployed on **Render.com**—expect **cold starts** if inactive.  
🔹 **Base URL:** [https://phoenix-imf-backend.onrender.com/](https://phoenix-imf-backend.onrender.com/)  

 **Heads-up:** System may take a few seconds to activate when idle. Be patient. Speed is crucial, but so is security.  

---

## **🛠️ Deployment Protocol (Docker Setup)**  

1. **Clone the Repository:**  
   ```sh
   git clone https://github.com/abhizaik/phoenix-imf.git
   cd phoenix-imf
   ```

2. **Secure the Mission Configs (`.env` file)**  
   ```sh
   NODE_ENV=development
   POSTGRES_USER=imf
   POSTGRES_PASSWORD=secret
   POSTGRES_DB=imf_database
   DATABASE_URL=postgresql://imf:secret@db:5432/imf_database?schema=public
   JWT_SECRET=someSuperSecret
   JWT_EXPIRES_IN=1d
   PORT=3000
   ```

3. **Deploy the System**  
   ```sh
   docker-compose up --build
   ```


---

## **🔐 Authentication Protocol**  

All gadget operations require authentication. **Attach your JWT token** in the request headers:  
```http
Authorization: Bearer <YOUR_TOKEN>
```
No token? **No access.** That simple.

---

## **📡 Operations Dashboard: Endpoints**  

### **🕵️ Identity Management**
- `POST /api/v1/auth/signup` → Register a new agent  
- `POST /api/v1/auth/login` → Authenticate and receive access credentials  
- `POST /api/v1/auth/logout` → Securely log out of the system  

### **🔧 Gadget Control**
- `GET /api/v1/gadgets` → Retrieve all IMF gadgets  
- `POST /api/v1/gadgets` → Deploy a new gadget into the field  
- `PATCH /api/v1/gadgets/:id` → Update gadget specs or operational status  
- `DELETE /api/v1/gadgets/:id` → Decommission a gadget (soft delete)  
- `POST /api/v1/gadgets/:id/self-destruct` → **Initiate self-destruct sequence** (irreversible)  


[Postman Documentation](https://documenter.getpostman.com/view/41653874/2sAYX3phYR)  

---

