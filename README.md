# 🧠 Student Study Management Website

A web-based platform designed to help **Cau Giay High School** students organize their study life — tracking assignments, deadlines, and personal progress — all in one place.

---

## 🚀 Features
- 📚 **Assignment Tracker:** View, add, and manage assignments and deadlines.
- 👥 **Class Collaboration:** See what classmates are working on and share study notes.
- 📅 **Personal Dashboard:** Track progress visually using completion charts.
- 🔔 **Deadline Reminders:** Email and in-app notifications.
- 🔐 **Secure Login:** User authentication with session management.

---

## 🛠️ Tech Stack
| Category | Technology |
|-----------|-------------|
| Backend | Python (Flask) |
| Frontend | HTML, CSS, JavaScript, Bootstrap |
| Database | SQLite (local) / PostgreSQL (deployment) |
| Hosting | Render / Railway (planned) |

---

## 🧩 Project Architecture
Flask App → Routes → Models (SQLite)  
↓  
Templates (Jinja2)  
↓  
Static Assets (CSS/JS)  

---

## 🧠 How It Works
1. **Students Register/Login**
2. **Add Assignments:** Title, subject, deadline, and notes
3. **Dashboard View:** Displays all assignments with status and progress
4. **Collaborative Mode (coming soon):** Share and sync with classmates

---

## 🧪 Tests
Basic unit tests for route handling and model operations are available under `/tests`.

Run:
```bash
pytest
