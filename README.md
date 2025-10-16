🧠 Student Study Management Website
--------------------------------

A web-based platform designed to help Cau Giay High School students organize their study life — tracking assignments, deadlines, and personal progress — all in one place.


🚀 FEATURES
-----------
• Assignment Tracker – View, add, and manage assignments and deadlines  
• Class Collaboration – See what classmates are working on and share notes  
• Personal Dashboard – Track progress visually using charts and status bars  
• Deadline Reminders – Email and in-app notifications  
• Secure Login – Session-based authentication system


🛠️ TECH STACK
--------------
Backend: Python (Flask)
Frontend: HTML, CSS, JavaScript, Bootstrap
Database: SQLite (local) / PostgreSQL (deployment)
Hosting: Render / Railway (planned)


🧩 PROJECT ARCHITECTURE
-----------------------
Flask App  →  Routes  →  Models (SQLite)
     ↓
  Templates (Jinja2)
     ↓
Static Assets (CSS / JS)


🧠 HOW IT WORKS
---------------
1. Students register and log in  
2. Add assignments (title, subject, deadline, and notes)  
3. Dashboard shows all assignments with progress status  
4. Collaborative mode (coming soon) will sync data between classmates


🧪 TESTING
----------
Basic unit tests for route handling and model operations are available in the /tests directory.

Run tests:
> pytest


📸 SCREENSHOTS
--------------
(Mockups for presentation — implementation in progress)

Login Page: docs/screenshots/login_mockup.png  
Dashboard: docs/screenshots/dashboard_mockup.png


📅 DEVELOPMENT TIMELINE
-----------------------
Phase                    | Status
-------------------------|---------
Planning & Wireframing   | Completed
Database Design          | Completed
Frontend Prototype       | Completed
Backend Integration      | In Progress
Deployment               | Upcoming


👤 AUTHOR
---------
[Your Name]  
Developer | Cau Giay High School  
Email: your.email@example.com


📜 LICENSE
----------
MIT License © 2024 [Your Name]
