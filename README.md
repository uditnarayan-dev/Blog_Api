# 📝 Blog API (Django + DRF + JWT)

A RESTful API for managing **blog posts, categories, and tags**, built using **Django REST Framework (DRF)** and secured with **JWT authentication**. This API is ideal for developers who want to integrate blog functionality into web or mobile frontends.

---

## 🚀 Live API URL
🔗 **EC2 Deployment:** http://3.111.130.128:8001/

---

## ✅ Features

| Feature                                  | Status |
|------------------------------------------|--------|
| User Registration & Login                | ✅     |
| JWT Authentication                       | ✅     |
| CRUD on Blog Posts                       | ✅     |
| CRUD on Categories                       | ✅     |
| Tags Support                             | ✅     |
| Only Owners Can Edit/Delete Their Posts  | ✅     |
| Permissions & Authentication             | ✅     |
| Pagination                               | ❌     |
| Search / Filtering                       | ❌     |
| API Documentation (Swagger/Postman)      | ❌ (Planned) |

---

## 🛠️ Tech Stack

| Layer        | Technology        |
|--------------|------------------|
| Backend      | Django REST Framework |
| Auth         | JWT (JSON Web Tokens) |
| Database     | PostgreSQL |
| Deployment   | AWS EC2 |
| Virtual Env  | `venv` |

---


---

## 📥 Installation & Local Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/BlogAPI.git
cd BlogAPI

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Visit: http://127.0.0.1:8000/