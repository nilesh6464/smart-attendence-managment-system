# 📊 Smart Attendance Management System (MERN)

A full-stack **Attendance Management System** built using the MERN stack that enables organizations to track employee attendance with **live selfie verification**, **geolocation**, and **role-based workflows**.

---

## 🚀 Live Demo

* 🌐 Frontend: *Add your deployed link here*
* 🔧 Backend: *Add your deployed link here*

---

## 🧠 Project Overview

This system allows employees to mark attendance using:

* 📸 Live selfie capture (no file upload)
* 📍 Real-time location (latitude & longitude)

It includes:

* Role-based access (**Employee / Manager / Admin**)
* Attendance validation system
* Overtime request & approval workflow
* Dashboard views for different roles
* Daily attendance reports

---

## 🛠 Tech Stack

### Frontend

* React.js (Vite)
* Redux Toolkit + RTK Query
* React Router

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### Other Tools

* JWT Authentication
* bcrypt (password hashing)
* Morgan / Winston (logging)

---

## ✨ Features

### 🔐 Authentication & Authorization

* Secure signup & login
* JWT-based authentication
* Role-Based Access Control (RBAC)
* Protected routes

---

### ⏱ Attendance System

* Punch In / Punch Out
* Capture:

  * Selfie using webcam
  * Location using browser geolocation
* Stores:

  * Punch-in time
  * Punch-out time
  * Image
  * Coordinates
  * Working hours

---

### 🧮 Working Hours Logic

* Automatically calculates total working hours
* Status:

  * ✅ Completed (≥ 8 hours)
  * ❌ Incomplete (< 8 hours)

---

### ⏳ Overtime Workflow

* Employees can request overtime
* Manager/Admin can:

  * Approve ✅
  * Reject ❌
* Status reflected in attendance

---

### 📊 Dashboards

#### 👤 Employee

* View personal attendance
* Track working hours
* View overtime requests

#### 👨‍💼 Manager

* View team attendance
* Manage overtime requests

#### 🛠 Admin

* View all users
* Monitor system-wide attendance

---

### ✅ Attendance Validation

* Manager/Admin can:

  * View employee selfies
  * Verify authenticity
  * Mark attendance:

    * Valid
    * Invalid
  * Add remarks

---

### 📄 Reports

* Generate daily attendance reports
* Includes:

  * Name
  * Punch-in/out time
  * Selfie
  * Location
  * Working hours
  * Status

---

## 🧱 Project Structure

```
root/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── app/
│   │   └── main.jsx
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/smart-attendance-system.git
cd smart-attendance-system
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run server:

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

### Backend

* `PORT`
* `MONGO_URI`
* `JWT_SECRET`

---

## ⚠️ Assumptions

* Each user has a single role (Employee / Manager / Admin)
* Location depends on browser permissions
* Selfie verification is manual (admin checks)
* One attendance record per day per user

---

## 🚧 Future Improvements

* 📍 Geofencing (attendance within office radius)
* 🔔 Notifications (missed punch / OT updates)
* ⚡ Real-time updates (Socket.IO)
* 🌙 Dark mode UI
* 📤 Export reports (PDF / Excel)

---

## 📌 Evaluation Highlights

* Clean architecture
* Scalable backend design
* Proper separation of concerns
* Real-world feature implementation
* Focus on core functionality

---


## ⭐ Final Note

This project focuses on **clean implementation, correctness, and usability** rather than unnecessary complexity.
# smart-attendence-managment-system
