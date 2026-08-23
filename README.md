# Dr. Habibi
> An online platform for corrective exercises and sports rehabilitation

## 📸 Overview
Dr. Habibi is a specialized platform designed for managing sports rehabilitation and corrective exercises. It connects patients with verified coaches who prescribe custom exercise routines, track clinical metrics, and monitor session progress.

## 🏗 Architecture
The application is structured as a client/server split.
- **Frontend**: A Single Page Application (SPA) built with React and Vite. It handles routing locally and maintains distinct portal views for Patients, Coaches, and Admins.
- **Backend**: A Node.js/Express server that manages the business logic, API endpoints, and authentication.
- **Database**: PostgreSQL database managed via Prisma ORM (v5).
- **Storage**: S3-compatible cloud storage (e.g., ArvanCloud) for handling secure file uploads like patient assessment videos.

## ✨ Features
- **Role-Based Portals**: Distinct dashboards and interfaces for Patients, Coaches, and Administrators with protected routes.
- **Coach Management**: Admin verification system for coach accounts; assignment algorithms matching patients based on gender and age constraints.
- **Exercise Prescriptions**: Detailed exercise assignments, including patient video submissions for technique review and daily clinical metric check-ins (pain, sleep, mood).
- **Session & Package Tracking**: Integrated tracking for purchased packages, automated session deductions, and coach commission calculations triggered by completed session reports.
- **Real-Time Chat**: Direct messaging between assigned patients and coaches using Socket.io.
- **Notification System**: Structurally distinct notifications for system alerts (assignments, payment updates, exercise feedback).
- **Payment Gateway Integration**: Mocked integration for Zarinpal payment processing, supporting package purchases and discount codes (percentage or fixed amount).

## 🛠 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS (v4), Zustand, React Router DOM (v7), Lucide React, Framer Motion.
- **Backend**: Node.js, Express, Prisma ORM (v5), PostgreSQL, Socket.io, JWT Authentication, AWS SDK (S3), Multer.

## 📋 Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL Database
- S3-compatible Storage Bucket (AWS, ArvanCloud, etc.)

## 🚀 Installation

1. **Clone the repository** (if you haven't already):
   `git clone <repository-url>`
   `cd dr_habibi`

2. **Install Frontend Dependencies**:
   `npm install`

3. **Install Backend Dependencies**:
   `cd server`
   `npm install`

## ⚙️ Environment Variables

Copy the `.env.example` file to `.env` in both the root and `server` directories and fill in the values.

| Variable | Description | Required | Location |
| :--- | :--- | :---: | :---: |
| `DISABLE_HMR` | Disable Hot Module Replacement (set to 'true') | No | Root |
| `GEMINI_API_KEY` | Key for AI features (if used) | No | Root |
| `PORT` | Port for the backend server (default 5000) | **Yes** | Server |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | Server |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens | **Yes** | Server |
| `S3_REGION` | S3 Region (e.g., us-east-1, or 'default') | No | Server |
| `S3_ACCESS_KEY` | S3 Access Key ID | **Yes** | Server |
| `S3_SECRET_KEY` | S3 Secret Access Key | **Yes** | Server |
| `S3_ENDPOINT` | Custom S3 Endpoint URL (Required for ArvanCloud) | No | Server |
| `S3_BUCKET_NAME` | The name of the S3 bucket to store files | **Yes** | Server |

## 🏃 Running the App

1. **Start the Backend** (from the `server` directory):
   Ensure your PostgreSQL database is running, then apply migrations:
   `npx prisma generate`
   `npx prisma db push`
   (Then start your node development script)

2. **Start the Frontend** (from the root directory):
   (Start your vite development script)
   The frontend will typically be available at `http://localhost:3000` (or the port specified by Vite).

## 🧪 Tests
Testing framework is not yet configured for this project.

## 📄 License
Copyright (c) 2026 sadegh shahidi / SA / Dr.habibi

All rights reserved. This source code is proprietary and confidential.
Unauthorized copying, distribution, or use of this code, via any medium,
is strictly prohibited without prior written permission from the copyright holder.
