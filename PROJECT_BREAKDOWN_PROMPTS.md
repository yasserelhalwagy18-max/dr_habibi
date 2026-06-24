# Project Breakdown: Corrective Exercises & Sports Rehab Platform

## 1. Current State vs. Missing Features

The current codebase is a **React + Vite Single Page Application (SPA)** with local state management (`store.ts`) mimicking user roles and data. It lacks a real backend, database, authentication, file storage, and several requested features.

### What is Missing?
1. **Dedicated Backend:** A Node.js backend to serve API endpoints.
2. **Database & Authentication:** Real database (e.g., PostgreSQL) to store users, packages, logs, and a real authentication flow (JWT).
3. **Cloud File Storage:** S3-compatible cloud storage integration for patient progress images, assessment uploads, and exercise videos.
4. **Payment Gateway:** Integration with an Iranian payment gateway (Zarinpal) for assessment and package payments, plus discount codes.
5. **Advanced Admin Panel:** A completely new dashboard for managing users, coaches, financial reports, and notifications.
6. **Coach Assignment Rules:** Backend logic to enforce gender matching (male to male, female to female) and age rules (children under 12 to female coaches).
7. **Public Pages:** Real implementations for Blog, Educational Videos (Aparat), Webinars, About Us, and Contact Us.
8. **Real-time Chat:** Communication between patient and coach.
9. **Financial & Commission System:** Tracking coach commissions and platform revenue.

---

## 2. Suggested Tech Stack

Based on the requirements and keeping the current Vite/React setup:
*   **Frontend:** **React + Vite** (Current setup) with React Router for navigation.
*   **Backend:** **Node.js with Express.js** or NestJS.
*   **Database:** **PostgreSQL** with **Prisma ORM** or Sequelize.
*   **Authentication:** Custom **JWT-based authentication**.
*   **File Storage:** **S3-Compatible Storage** (like ArvanCloud or Liara Object Storage) using AWS SDK.
*   **Styling:** **Tailwind CSS** + **Lucide React** (Keep current UI).
*   **Payments:** **Zarinpal Node.js SDK**.

---

## 3. Implementation Prompts (Actionable Parts)

Below are the carefully divided prompts. **Do not use them all at once.** Provide them to the AI one by one in separate sessions or turns to build the platform incrementally without overwhelming the context.

### Part 1: Backend Setup & Database Architecture
**Prompt:**
> "We are keeping our Vite/React frontend and building a separate Node.js/Express backend. Please initialize the Node.js backend project in a new folder called `server`. Then, design a Prisma schema (`schema.prisma`) for a PostgreSQL database that includes models for: User (Admin, Coach, Patient), PatientProfile, CoachProfile, Packages, Sessions, PainLogs, Transactions, and Messages. Make sure to include fields for tracking coach commissions and patient package status."

### Part 2: Authentication API & Frontend Integration
**Prompt:**
> "Using the Node.js Express backend and Prisma, implement a JWT-based authentication system. Create API routes for registration and login, ensuring roles (`ADMIN`, `COACH`, `PATIENT`) are included in the JWT payload. Then, on the Vite/React frontend, implement React Router, create login/register pages, store the JWT securely, and create protected route components based on user roles."

### Part 3: Public Pages & Router Setup
**Prompt:**
> "On the Vite/React frontend, expand the React Router setup to include the public pages: Home, About Us, Dr. Amir Habibi Profile, Services, Blog list, and Webinars. Create a component to embed Aparat videos for the educational video section. Ensure these routes are accessible without authentication."

### Part 4: Assessment Form API & S3 File Uploads
**Prompt:**
> "In the Node.js backend, implement an AWS S3 integration (for S3-compatible services like ArvanCloud) to handle image and video uploads. Create an API endpoint to receive the Patient Assessment Form data (personal info, activity level, injury history, pain zones) along with media files. Save the form data and media URLs to the Prisma database. On the frontend, update the Assessment Form to send data to this new API."

### Part 5: Coach Allocation Logic & Admin Panel
**Prompt:**
> "In the backend, build the logic for assigning a patient to a coach upon registration/assessment. The rules are: Male patients to Male coaches, Female patients to Female coaches, and Children under 12 ONLY to Female coaches. Then, create the Admin Panel UI in the React frontend (accessible only by ADMIN role) to manage users, approve coach accounts, view financial reports, and manage platform notifications, connecting it to corresponding new backend APIs."

### Part 6: Zarinpal Payment Integration & Packages
**Prompt:**
> "Implement the payment flow in the Node.js backend using the Zarinpal API. Create endpoints to initiate a transaction and verify a transaction for the '12-Session Package', '24-Session Package', and 'Initial Assessment Fee'. Implement a discount code system. Update the user's package status in the database upon successful payment. On the frontend, connect the pricing section buttons to trigger this payment flow."

### Part 7: Patient Portal
**Prompt:**
> "Connect the Patient Portal UI in React to the backend APIs. The portal needs to fetch and display: 1. Active 12 or 24-session package status. 2. Assigned exercise program and educational videos. Implement the ability to: 3. Upload videos of themselves performing the exercises (using the backend S3 API). 4. Submit a weekly progress check-in, tracking pain levels. 5. View history logs."

### Part 8: Coach Portal & Real-time Chat
**Prompt:**
> "Connect the Coach Portal UI to backend APIs so coaches can see their assigned patients, view patient progress logs, uploaded exercise videos, log session reports, and view their calculated commission/income. Additionally, implement a Chat system using Socket.io in the backend and frontend for real-time communication between the Coach and the Patient."