# Dr. Habibi
> An online platform for corrective exercises and sports rehabilitation

<!-- Badges placeholder: build status, license, version -->
<!-- e.g. [![Build Status](...)]() [![License: Proprietary](...)]() -->

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Running Locally](#running-locally)
7. [Running Tests](#running-tests)
8. [Project Structure](#project-structure)
9. [Contributing](#contributing)
10. [License](#license)

## Features
- **Role-Based Portals**: Distinct dashboards and interfaces for Patients, Coaches, and Administrators with protected routes.
- **Coach Management**: Admin verification system for coach accounts; assignment algorithms matching patients based on gender and age constraints.
- **Exercise Prescriptions**: Detailed exercise assignments, including patient video submissions for technique review and daily clinical metric check-ins (pain, sleep, mood).
- **Session & Package Tracking**: Integrated tracking for purchased packages, automated session deductions, and coach commission calculations triggered by completed session reports.
- **Real-Time Chat**: Direct messaging between assigned patients and coaches using Socket.io.
- **Notification System**: Structurally distinct notifications for system alerts (assignments, payment updates, exercise feedback).
- **Payment Gateway Integration**: Mocked integration for Zarinpal payment processing, supporting package purchases and discount codes (percentage or fixed amount).
- **Progress Tracking**: Track clinical metrics (pain, sleep, mood) via a unified progress check-in model and pain log.
- **Data Export & Reporting**: Export tools utilizing html2canvas and jspdf.

## Tech Stack
### Frontend
- **Framework**: React 19, Vite
- **Styling**: Tailwind CSS (v4), Framer Motion, Lucide React
- **State Management**: Zustand
- **Routing**: React Router DOM (v7)
- **Data Visualization**: Recharts
- **PDF Generation**: HTML2Canvas, jsPDF
- **Networking/Real-time**: Socket.io-client

### Backend
- **Runtime/Framework**: Node.js, Express (v5.2.1)
- **Database ORM**: Prisma Client (v5.22.0)
- **Authentication**: JSON Web Tokens (jsonwebtoken)
- **Real-time**: Socket.io
- **Storage/File Uploads**: AWS SDK S3 Client, Multer
- **Other**: UUID, node-fetch, dotenv, cors

## Prerequisites
- **Node.js**: v18 or higher recommended
- **Database**: PostgreSQL
- **Storage**: S3-compatible Storage Bucket (AWS, ArvanCloud, etc.)

## Installation
1. **Clone the repository**:
   ```sh
   git clone <repository-url>
   cd dr_habibi
   ```
2. **Install Frontend Dependencies**:
   ```sh
   npm install
   ```
3. **Install Backend Dependencies**:
   ```sh
   cd server
   npm install
   ```
4. **Database Setup**:
   Ensure your PostgreSQL database is running, then apply the schema and generate the Prisma Client:
   ```sh
   cd server
   npx prisma db push
   npx prisma generate
   ```

## Environment Variables
Copy `.env.example` to `.env` in both the root and `server` directories and populate them.

### Frontend (.env.local)
| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `DISABLE_HMR` | Disable Hot Module Replacement in Vite | No | `true` |
| `GEMINI_API_KEY` | Key for AI features (if used) | No | `AIzaSy...` |

### Backend (server/.env)
| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `PORT` | Backend server port | **Yes** | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | `postgres://user:pass@localhost:5432/dbname` |
| `JWT_SECRET` | Secret key for signing JWTs | **Yes** | `supersecretkey` |
| `S3_REGION` | S3 Region | No | `default` |
| `S3_ACCESS_KEY` | S3 Access Key ID | **Yes** (if using S3) | `AKIAIOSFODNN7EXAMPLE` |
| `S3_SECRET_KEY` | S3 Secret Access Key | **Yes** (if using S3) | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `S3_ENDPOINT` | Custom S3 Endpoint URL (e.g. ArvanCloud) | No | `https://s3.ir-thr-at1.arvanstorage.ir` |
| `S3_BUCKET_NAME` | Name of the S3 bucket | **Yes** (if using S3) | `dr-habibi-assets` |

## Running Locally

1. **Start the Backend**:
   ```sh
   cd server
   npm run start:dev
   ```
   *(Note: Ensure you have run the Database Setup commands listed in the Installation section before starting the server. If using the default script, run `npm run dev`.)*

2. **Start the Frontend**:
   ```sh
   npm run start:dev
   ```
   *(If using the default script, run `npm run dev`.)*
   The frontend will typically be available at `http://localhost:3000` (or the port specified by Vite).

## Running Tests
No tests configured yet.

## Project Structure
```text
dr_habibi/
├── src/                 # Frontend React application source code
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page layout wrappers (Public, Protected)
│   ├── pages/           # Route components (Public, Patient, Coach, Admin)
│   └── store.ts         # Zustand global state management
├── server/              # Backend Node.js/Express application
│   ├── src/             # Backend source code (Controllers, Routes, etc.)
│   └── prisma/          # Prisma ORM schema and migrations
├── dist/                # Frontend production build output
└── package.json         # Frontend dependencies and scripts
```

## Contributing
This is a private, proprietary project. External contributions are not accepted.

## License
Copyright (c) 2026 sadegh shahidi / SA / Dr.habibi

All rights reserved. This source code is proprietary and confidential.
Unauthorized copying, distribution, or use of this code, via any medium,
is strictly prohibited without prior written permission from the copyright holder.

<!--
Note:
- Badges section is a placeholder since no CI/CD or registry is currently detected.
- Contributing section is formulated according to the proprietary nature of the project.
-->
