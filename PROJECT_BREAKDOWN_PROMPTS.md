# Project Breakdown: Corrective Exercises & Sports Rehab Platform

## 1. Current State vs. Missing Features

The current codebase is a **React + Vite Single Page Application (SPA)** with local state management (`store.ts`) mimicking user roles and data. It lacks a real backend, database, authentication, file storage, and several requested features.

### What is Missing?
1. **Full-Stack Architecture:** Migration to Next.js (or adding a dedicated Node.js/Express backend) to support SEO, API endpoints, and a real database.
2. **Database & Authentication:** Real database (e.g., PostgreSQL) to store users, packages, logs, and a real authentication flow (JWT or OAuth).
3. **Cloud File Storage:** S3-compatible cloud storage integration for patient progress images, assessment uploads, and exercise videos.
4. **Payment Gateway:** Integration with an Iranian payment gateway (Zarinpal) for assessment and package payments, plus discount codes.
5. **Advanced Admin Panel:** A completely new dashboard for managing users, coaches, financial reports, and notifications.
6. **Coach Assignment Rules:** Backend logic to enforce gender matching (male to male, female to female) and age rules (children under 12 to female coaches).
7. **Public Pages:** Real implementations for Blog, Educational Videos (Aparat), Webinars, About Us, and Contact Us.
8. **Real-time Chat:** Communication between patient and coach.
9. **Financial & Commission System:** Tracking coach commissions and platform revenue.

---

## 2. Suggested Tech Stack

Based on the requirements, here is the highly recommended, modern tech stack for this platform:
*   **Framework:** **Next.js (App Router)** - Handles both Frontend UI and Backend API routes effortlessly, while providing excellent SEO for blogs.
*   **Database:** **PostgreSQL** (hosted on Supabase, Neon, or Liara) with **Prisma ORM** for easy database management.
*   **Authentication:** **NextAuth.js (Auth.js)** or **Supabase Auth** for secure login and Role-Based Access Control (RBAC).
*   **File Storage:** **S3-Compatible Storage** (like ArvanCloud or Liara Object Storage) using AWS SDK.
*   **Styling:** **Tailwind CSS** + **Lucide React** (Keep the current UI, just migrate the components).
*   **Payments:** **Zarinpal Node.js SDK**.

---

## 3. Implementation Prompts (Actionable Parts)

Below are the carefully divided prompts. **Do not use them all at once.** Provide them to the AI one by one in separate sessions or turns to build the platform incrementally without overwhelming the context.

### Part 1: Initial Setup & Database Architecture
**Prompt:**
> "We are migrating our Vite/React clinic app to a full-stack Next.js (App Router) application. Please initialize the Next.js setup plan. Then, design a Prisma schema (`schema.prisma`) for a PostgreSQL database that includes models for: User (Admin, Coach, Patient), PatientProfile, CoachProfile, Packages, Sessions, PainLogs, Transactions, and Messages. Make sure to include fields for tracking coach commissions and patient package status."

### Part 2: Authentication & Role Management
**Prompt:**
> "Using the Next.js app and Prisma schema we created, implement NextAuth.js credentials authentication. Set up a secure login and registration flow. Ensure that the session includes the user's role (`ADMIN`, `COACH`, `PATIENT`). Create a higher-order component or middleware to protect routes based on these roles."

### Part 3: Public Pages & Landing Page Migration
**Prompt:**
> "Migrate the existing landing page UI from the Vite project to our Next.js app. Implement the public pages: Home, About Us, Dr. Amir Habibi Profile, Services, Blog list, and Webinars. Create a component to embed Aparat videos for the educational video section. Ensure these pages are fully SEO-optimized using Next.js metadata."

### Part 4: Assessment Form & S3 File Uploads
**Prompt:**
> "Implement the Patient Assessment Form in Next.js. The form needs to collect: personal info, height/weight, age, gender, activity level, injury history, surgery history, and pain zones. Also, implement an AWS S3 integration (for S3-compatible services like ArvanCloud) to allow users to upload images and videos of their movement/pain areas. Save the form data and media URLs to the Prisma database."

### Part 5: Coach Allocation Logic & Admin Panel
**Prompt:**
> "Build the backend logic for assigning a patient to a coach upon registration/assessment. The rules are: Male patients to Male coaches, Female patients to Female coaches, and Children under 12 ONLY to Female coaches. Then, create the Admin Panel UI (accessible only by ADMIN role) to manage users, approve coach accounts, view financial reports, and manage platform notifications."

### Part 6: Zarinpal Payment Integration & Packages
**Prompt:**
> "Implement the payment flow using the Zarinpal API. Create endpoints to initiate a transaction and verify a transaction. Connect this to the purchase of the '12-Session Package' and '24-Session Package', and the 'Initial Assessment Fee'. Implement a discount code system that recalculates the final price before sending the user to the Zarinpal gateway. Update the user's package status in the database upon successful payment."

### Part 7: Patient Portal
**Prompt:**
> "Build the Patient Portal UI and API integration. The patient should be able to: 1. View their active 12 or 24-session package status. 2. View their assigned exercise program and educational videos. 3. Upload videos of themselves performing the exercises (using the S3 integration). 4. Fill out a weekly progress check-in, tracking their pain level on a scale. 5. View their history."

### Part 8: Coach Portal & Real-time Chat
**Prompt:**
> "Build the Coach Portal UI and API. Coaches should be able to see their assigned patients, view patient progress logs and uploaded exercise videos, log session reports, and view their calculated commission/income. Additionally, implement a Chat interface for communication between the Coach and the Patient (you can use Next.js API routes with SWR for polling, or setup simple WebSockets/Pusher for real-time messaging)."
