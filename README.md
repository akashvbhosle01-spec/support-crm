# Support CRM — Customer Support Ticketing System

A full-stack customer support ticketing system built with React, Node.js, Express, and MongoDB.

## 🚀 Live Demo

**Frontend:**
https://support-crm-inky.vercel.app/

**Backend API:**
https://support-crm-api-bhtc.onrender.com

**API Base URL:**
https://support-crm-api-bhtc.onrender.com/api

**GitHub Repository:**
https://github.com/akashvbhosle01-spec/support-crm

---

## 📌 Features

* Create customer support tickets
* View all support tickets
* Search tickets
* Filter tickets by status
* View ticket details
* Update ticket status
* Add notes to tickets
* Copy ticket ID
* Priority levels: Low, Medium, High, Urgent
* Priority-based SLA tracking
* Overdue ticket indicator
* Toast notifications
* Loading skeletons
* Responsive UI

---

## ⭐ Bonus Feature — Priority-Based SLA

Each ticket has a priority level with a different SLA:

| Priority |      SLA |
| -------- | -------: |
| Low      | 48 hours |
| Medium   | 24 hours |
| High     |  8 hours |
| Urgent   |  4 hours |

The system automatically calculates the SLA deadline based on ticket priority and shows an **Overdue** indicator when the SLA has been breached.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* React Router
* Axios

### Backend

* Node.js
* Express.js
* Mongoose
* REST API

### Database

* MongoDB Atlas

### Deployment

* Vercel — Frontend
* Render — Backend
* MongoDB Atlas — Database

---

## 🏗️ Architecture

```text
User
  ↓
React + Vite Frontend
  ↓
REST API
  ↓
Node.js + Express Backend
  ↓
Mongoose
  ↓
MongoDB Atlas
```

---

## 🔌 API Endpoints

### Tickets

| Method | Endpoint           | Description        |
| ------ | ------------------ | ------------------ |
| POST   | `/api/tickets`     | Create a ticket    |
| GET    | `/api/tickets`     | Get all tickets    |
| GET    | `/api/tickets/:id` | Get ticket details |
| PUT    | `/api/tickets/:id` | Update ticket      |

### Supported Filters

```text
GET /api/tickets?status=Open
GET /api/tickets?search=customer
```

---

## 🗄️ Database

The application uses MongoDB Atlas.

### Ticket

Main ticket fields include:

* Ticket ID
* Customer name
* Customer email
* Subject
* Description
* Status
* Priority
* Created date
* Updated date

### Notes

Each ticket can contain multiple notes with timestamps.

---

## 💻 Local Setup

### 1. Clone the repository

```bash
git clo
```
