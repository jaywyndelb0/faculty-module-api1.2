# Faculty Module REST API

A complete Faculty Module REST API built with Laravel 12.x and MySQL (XAMPP), featuring staff authentication, student management, grading, and attendance tracking.

## 🚀 Getting Started

### Prerequisites
- **XAMPP** (with MySQL and PHP 8.2+)
- **Composer** installed

### Installation & Setup

1. **Clone/Open the Project**
   Ensure you are in the project root directory: `c:\Users\MARY GRACE\Desktop\faculty-api`

2. **Database Configuration**
   - Open XAMPP Control Panel and start **Apache** and **MySQL**.
   - Create a database named `school_system` in phpMyAdmin.
   - The `.env` file is already configured with:
     ```env
     DB_DATABASE=school_system
     DB_USERNAME=root
     DB_PASSWORD=
     ```

3. **Install Dependencies** (if not already done)
   ```bash
   composer install
   ```

4. **Run Migrations & Seed**
   This will create all necessary tables and populate them with Pinoy sample data (Juan Dela Cruz, BSIT, BEED, etc.).
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Start the Server**
   Run the following command to make the API accessible at `127.0.0.1:8000`:
   ```bash
   php artisan serve --host=127.0.0.1
   ```

---

## 🛠 Testing the API

### 1. Interactive Web Dashboard
You can test all API routes (including new CRUD features) directly in your browser:
- URL: [http://127.0.0.1:8000/test-api](http://127.0.0.1:8000/test-api)
- **Note**: You must **Login** using the default credentials below to unlock the modules.

### 2. Postman Instructions

#### **Staff Authentication (Public)**
- **Login**: `POST /api/login`
  - Body (JSON): `{"email": "admin@school.edu", "password": "password123"}`
- **Register**: `POST /api/register`
  - Body (JSON): `{"name": "Admin", "email": "admin@school.edu", "password": "password123", "password_confirmation": "password123"}`

#### **Faculty Management (Protected)**
- **List All**: `GET /api/faculty`
- **View Single**: `GET /api/faculty/{id}`
- **Create**: `POST /api/faculty`
  - Body (JSON): `{"name": "Name", "email": "email@school.edu", "department": "IT"}`
- **Update**: `PUT /api/faculty/{id}`
  - Body (JSON): `{"name": "Updated Name"}`
- **Delete**: `DELETE /api/faculty/{id}`
- **View Schedule**: `GET /api/faculty/{id}/schedule`

#### **Section Assignment (Protected)**
- **View Assignment**: `GET /api/sections/{id}/faculty`
- **Assign Faculty**: `POST /api/sections/{id}/assign-faculty`
  - Body (JSON): `{"faculty_id": 1}`
- **Remove Faculty**: `DELETE /api/sections/{id}/remove-faculty`
- **View Classlist**: `GET /api/sections/{id}/classlist`

#### **Grades Management (Protected)**
- **List All**: `GET /api/grades`
- **Upload Grade**: `POST /api/grades`
  - Body (JSON): `{"student_id": 1, "subject": "Math", "grade": "1.25"}`
- **Update Grade**: `PUT /api/grades/{id}`
  - Body (JSON): `{"grade": "1.50"}`
- **Delete Grade**: `DELETE /api/grades/{id}`
- **View Student Grades**: `GET /api/grades/{studentId}`

#### **Attendance Management (Protected)**
- **Record Attendance**: `POST /api/attendance`
  - Body (JSON): `{"student_id": 1, "date": "2026-03-06", "status": "present"}`
- **Update Attendance**: `PUT /api/attendance/{id}`
  - Body (JSON): `{"status": "absent"}`
- **View Student Attendance**: `GET /api/attendance/{studentId}`

---

## 📂 Project Structure
- **Controllers**: `app/Http/Controllers/FacultyController.php` (Core logic)
- **Models**: `app/Models/` (Faculty, Student, Grade, Attendance, etc.)
- **Routes**: `routes/api.php`
- **Migrations**: `database/migrations/`
- **Seeders**: `database/seeders/SchoolSystemSeeder.php` (Pinoy sample data)
- **Test UI**: `resources/views/test-api.blade.php`

## 🔐 Security
Authentication is handled via **Laravel Sanctum**. All management routes require a valid Bearer token obtained through the login endpoint.
