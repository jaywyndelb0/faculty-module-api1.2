# EduAdmin Management System: Professional Overview

## 1. System Overview
- **Description**: The EduAdmin Management System is a centralized academic management platform designed to streamline administrative tasks for educational institutions.
- **Purpose**: It serves as a bridge between Admission, Registrar, and Faculty operations, automating student enrollment, section assignments, grade management, and attendance tracking through a modern web interface.

## 2. Modules and Functions
- **Faculty Module**: Manages faculty records, including department assignments and subject expertise. It allows administrators to assign faculty members to specific sections and subjects.
- **Students Module**: A central repository for student records. It handles local student data and integrates with the Admission module for external student syncing.
- **Grades Module**: Facilitates the secure uploading and updating of student grades per subject. It features a streamlined, non-blocking UI for rapid data entry.
- **Attendance Module**: Enables daily tracking of student attendance (Present, Late, Absent, Excused) with automated performance summaries and history logs.
- **Registrar Integration**: Synchronizes real-time data from the Registrar Module, including Sections (Schedule, Room) and Subjects.
- **Admission Integration**: Connects with the Admission Module to fetch verified applicants and prepare them for enrollment.

## 3. System Flow (Step-by-Step)
1.  **Admission**: A student is verified and approved in the external Admission Module.
2.  **Student Sync**: The Faculty system fetches these verified students via an API key.
3.  **Auto Enrollment**: The system automatically creates a local student record and assigns a default section to avoid manual data entry.
4.  **Section Assignment**: Students are organized into sections retrieved from the Registrar Module.
5.  **Faculty Assignment**: Faculty members are assigned to handle specific sections and subjects.
6.  **Attendance**: Faculty records daily student attendance within their assigned sections.
7.  **Grades**: At the end of the term, faculty upload student grades, which are then stored locally for reporting.

## 4. Detailed Flow Per Feature
- **Student Sync Flow**:
  - User clicks "Refresh Sync" → Frontend calls Admission API → Normalized data is displayed → Backend check for existing records.
- **Auto Enrollment Flow**:
  - System identifies a new external student → Generates a local profile → Maps to the first available local Section ID → Saves to `students` table.
- **Grade Upload Flow**:
  - Select Student/Subject → Input Grade → Async POST request to `/api/grades` → Instant local UI update with success toast.
- **Attendance Recording Flow**:
  - Select Student/Date/Status → Async POST to `/api/attendance` → Immediate update of the student's attendance rate and history.
- **Faculty Assignment Flow**:
  - Select Faculty Member → Select Subject/Section → Update `faculty` table → Faculty now appears in class lists and schedules.

## 5. API Flow (Frontend ↔ Backend)
- **Architecture**: The system uses a decoupled architecture.
- **Frontend (Angular)**: Sends HTTP requests (GET, POST, PUT, DELETE) to the backend. It handles UI states and local data filtering for a smooth user experience.
- **Backend (Laravel)**: Acts as a RESTful API. It validates incoming data, manages the SQLite database, handles security (Sanctum), and communicates with external module APIs (Admission & Registrar).

## 6. Data Flow
- **Admission → Faculty**: External student data (Name, Email, External ID) flows into the local `students` table.
- **Registrar → Faculty**: Section names, schedules, rooms, and subject lists are pulled from the Registrar's database to populate dropdowns and schedules.
- **Faculty → Local DB**: Attendance marks and grade records are generated locally and stored in the institution's private database.

## 7. Key Features
- **Auto Enrollment**: Eliminates the need for a manual "Enroll" button by automatically creating local records during the sync process.
- **Duplicate Prevention**: Uses `external_id` and `email` checks to ensure a student is never enrolled twice.
- **Real-time Sync**: Pulls the latest data from Admission and Registrar modules with a single click.
- **Section-based Management**: Automatically organizes students and faculty by their assigned sections for better class monitoring.

## 8. Summary (Simple Explanation for Defense)
> "Our EduAdmin Management System is an integrated solution that automates the transition from admission to classroom management. By connecting directly with the Admission and Registrar modules, we've eliminated manual data entry through **Auto Enrollment**. When a student is synced, the system automatically creates their record, assigns a section, and makes them immediately available for faculty to track their **Attendance** and upload their **Grades**. This ensures that data remains consistent, accurate, and accessible across all academic departments."
