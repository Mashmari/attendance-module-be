# attendance-module-be
Attendance Module Backend-

This project is a Node.js backend for managing an attendance module. It provides RESTful APIs to handle various attendance-related operations, including creating, updating, and retrieving attendance records. The project integrates with a MySQL database and manages image uploads for student attendance.

Features-
CRUD Operations: Perform create, read, update, and delete operations on attendance records.

Image Handling: Upload and manage student attendance images.

Database Integration: Seamlessly integrates with MySQL for data storage.

Environment Configurations: Configurable via a .env file for easy setup in different environments.

Prerequisites-

1.Node.js (v18.18.2 or later)
2.MySQL database


Steps-
1.Navigate to the project directory:
   cd-reponame

2.Alter `.env` file in the root of your project and change the following variables:
- PORT = Your backend port
- DB_HOST = Your database host
- DB_USER = Your database user
- DB_PASSWORD = Your database password
- DB_NAME = Your database name
- PHOTO_PASTING_PATH = Your photo pasting path(e.g., C:/Users/CDOT/CIAS_DATA/ENROLL_IMG)
- FILE_ROOT_PATH = Your file root path (e.g., C:/Users)

3.Install dependencies:
   npm install

4.Start the server:
   node index.js

