# 🏡 Anondo Housing – Client Management System

A web-based client management system designed to help Anondo Housing organize, upload, manage, and monitor client information across its housing projects.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Image_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

## 📖 About the Project

**Anondo Housing Client Management System** is a web application developed to simplify client information management for housing and real estate projects.

The system provides an employee-facing client submission form and an administrator dashboard for managing submitted client records. It allows client information to be stored in a centralized database, making records easier to access and manage.

The application is built with React for the frontend and Node.js with Express.js for backend API services. MySQL is used for database management, while Cloudinary supports client image storage.

## 🎯 Project Objectives

- Digitize the client information collection process.
- Centralize client records for easier management.
- Organize clients by housing project.
- Store client photographs alongside their information.
- Provide administrators with secure dashboard access.
- Simplify client searching and record management.
- Support remote access through web hosting.

## ✨ Key Features

### 📝 Client Information Upload

Employees can submit client information through a web form without needing an employee login.

The form includes:

- Client photograph
- Client name
- Client mobile number
- Salesperson name
- Plot number
- Project name
- Visit date
- Client status

### 🏘️ Multiple Housing Projects

The project form supports the following project options:

- Anondo Housing Society
- Anondo Bhuban

This helps organize client records according to their respective housing projects.

### 🔐 Administrator Login

An administrator login interface provides access to the client management dashboard.

The backend includes authentication-related functionality and password hashing using bcrypt.

### 📊 Admin Dashboard

Administrators can access submitted client records and manage client information through a centralized dashboard.

Dashboard functionality includes:

- Viewing client records
- Searching client information
- Viewing client photographs
- Deleting client records
- Changing the administrator password
- Changing the administrator email address

### 🖼️ Image Storage

Client photographs are uploaded through the application. Cloudinary integration supports remote image storage, while the backend also provides an uploads directory for serving existing local images.

### 🗄️ Database Management

MySQL stores client records, including contact information, project details, visit dates, client status, and image URLs.

### 🌐 Web-Based Access

The application uses a separate frontend and backend, allowing the user interface and API to be hosted independently.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| JavaScript | Application logic |
| HTML5 | Website structure |
| CSS3 | Styling and layout |
| Node.js | Backend runtime |
| Express.js | REST API and server routing |
| MySQL | Relational database |
| mysql2 | MySQL database connectivity |
| Cloudinary | Client image storage |
| Multer | File upload handling |
| JWT | Authentication tokens |
| bcrypt | Password hashing |
| Axios | Frontend API communication |
| Nodemailer | Email functionality support |
| Netlify | Frontend hosting |
| Render | Backend hosting |

## 🏗️ System Architecture

The application follows a client-server architecture.

```text
             Employee / Administrator
                       |
                       v
                 Web Browser
                       |
                       v
               React + Vite Frontend
                       |
                 HTTP / REST API
                       |
                       v
              Node.js + Express.js
                       |
             +---------+---------+
             |                   |
             v                   v
        MySQL Database        Cloudinary
         Client Records      Client Photos
```

## 📂 Project Structure

```text
ananda-housing/
│
├── public/
│   ├── background.jpg
│   ├── favicon.svg
│   ├── icons.svg
│   └── logo.jpeg
│
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── ClientForm.jsx
│   │   └── Navbar.jsx
│   │
│   ├── pages/
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   └── UploadClient.jsx
│   │
│   ├── services/
│   │   └── api.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── clientController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── clientRoutes.js
│   ├── utils/
│   │   └── seedAdmin.js
│   ├── app.js
│   └── package.json
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Install the following:

- Node.js and npm
- MySQL database
- Cloudinary account for remote image storage
- Git (optional)

### Step 1: Clone the Repository

```bash
git clone https://github.com/MuniraRoma/Anondo-Housing-Client-Management.git
cd Anondo-Housing-Client-Management/ananda-housing
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file inside the `server/` directory.

Configure the required values using your own database credentials and service keys.

```env
PORT=5000

DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name

JWT_SECRET=your_secure_jwt_secret

ADMIN_NAME=Super Admin
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_admin_password

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace all example values with your actual configuration. Use the variable names expected by your application and configure any additional email settings required by the backend.

**Security:** Never commit `.env` files, database passwords, JWT secrets, or Cloudinary API secrets to GitHub.

### Step 4: Start the Backend

Open a terminal in the project directory:

```bash
cd server
npm install
npm run dev
```

The backend uses the `PORT` environment variable or defaults to port `5000`.

### Step 5: Configure the Frontend API

Check `src/services/api.jsx` and configure its API base URL to point to your running backend.

For local development, the base URL will typically be:

```text
http://localhost:5000/api
```

For production, use your deployed backend URL followed by `/api`.

### Step 6: Start the Frontend

Open another terminal in the main `ananda-housing` directory:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### Step 7: Build for Production

```bash
npm run build
```

The production frontend files are generated in the `dist/` directory.

## 🚀 Deployment

The application can be deployed using separate hosting services for the frontend and backend.

### Frontend — Netlify

1. Connect the GitHub repository to Netlify.
2. Set the frontend base directory to `ananda-housing` if that is the directory containing the frontend `package.json`.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Configure the frontend API URL to use the deployed backend.

### Backend — Render

1. Create a Web Service connected to the GitHub repository.
2. Set the root directory to `ananda-housing/server`.
3. Set the build command to `npm install`.
4. Set the start command to `npm start`.
5. Add the required environment variables in the Render dashboard.
6. Confirm that the backend can connect to the configured MySQL database and Cloudinary.

### Database — MySQL

Use a reachable MySQL database and configure the backend connection details through environment variables. Ensure the database schema and required tables are created before using the application.

## 🔐 Security Considerations

- Protect administrator-only routes with authentication middleware.
- Keep credentials and API secrets out of source control.
- Use strong administrator passwords.
- Configure appropriate CORS origins for production.
- Validate uploaded files and incoming form data.
- Use HTTPS for production traffic.
- Back up client records regularly.
- Avoid exposing detailed internal server errors to public users.

## 🔮 Future Improvements

- Export client records to Excel or PDF.
- Add advanced filtering by project, visit date, and status.
- Add pagination for large client lists.
- Introduce employee accounts and activity tracking if required.
- Improve reporting and sales analytics.
- Add automated email notifications after client submissions.
- Add audit logs for administrative actions.

## 📌 Project Information

- **Project Name:** Anondo Housing Client Management System
- **Project Type:** Web-Based Client Management Application
- **Frontend:** React.js and Vite
- **Backend:** Node.js and Express.js
- **Database:** MySQL
- **Image Storage:** Cloudinary
- **Frontend Hosting:** Netlify
- **Backend Hosting:** Render

## 👩‍💻 Author

**Wasima Khanom Munira**

GitHub: [@MuniraRoma](https://github.com/MuniraRoma)

## 📄 License

Specify the license applicable to this project before distributing or reusing its source code.

---

Developed to make client information management more organized, accessible, and efficient for Anondo Housing.
