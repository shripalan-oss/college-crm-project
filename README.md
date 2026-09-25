# Collab CRM Platform

A sleek, professional Customer Relationship Management (CRM) platform built to manage donors, campaigns, and donation outcomes. This project was developed as a comprehensive Database Management Systems project, featuring a decoupled modern architecture.

## 🌟 Key Features

* **Advanced Donor Intelligence:** Track donor behavior and perform RFM (Recency, Frequency, Monetary) analysis.
* **Campaign & Outcome Tracking:** Monitor ongoing fundraising campaigns and track their real-world impact metrics.
* **Professional PDF Exports:** Automatically generate and download professional, formatted PDF reports of all tabular data.
* **Modern Security:** Full JWT-based authentication flow including secure registration, login, and simulated email verification.
* **Premium UI/UX:** A custom, glassmorphic, Apple-inspired interface built with React.

## 🛠️ Technology Stack

* **Frontend:** React (via Vite), Axios, jsPDF (for reporting)
* **Backend:** Python, Flask, Flask-SQLAlchemy, Flask-CORS, Flask-Migrate
* **Database:** SQLite (Development) / PostgreSQL (Production)

## 🚀 Local Development Setup

To run this project locally, you will need two terminal windows to run the frontend and backend simultaneously.

### 1. Backend (Flask API)
```bash
cd backend
python -m venv myenv
# Activate virtual environment (Windows: myenv\Scripts\activate, Mac: source myenv/bin/activate)
pip install -r requirements.txt
python run.py
```
*The backend will run on `http://127.0.0.1:5000`*

### 2. Frontend (React UI)
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## 🔒 Authentication Note (Email Simulation)
For security and privacy, this application does not use a live SMTP email server to send verification emails to real inboxes. Instead, it utilizes an **Email Simulation System**. When a new user registers, the secure verification link is logged directly into the Backend Server Terminal (or Render Logs in production). The developer must copy and paste this link to verify the account.
