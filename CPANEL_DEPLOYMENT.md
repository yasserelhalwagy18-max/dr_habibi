# cPanel Deployment Guide for Dr. Habibi Platform

This guide will walk you through the step-by-step process of uploading and running this project on a cPanel hosting account. It is written for beginners, so don't worry if you haven't done this before!

## Important Notes Before Starting
*   **Database:** This project is built to use **PostgreSQL**. Most standard cPanel accounts only offer **MySQL**. You have two options:
    1.  Ask your hosting provider if they can enable PostgreSQL on your cPanel account.
    2.  Use a free/cheap external PostgreSQL database provider (like Supabase, Neon, or Render) and just connect to it from your cPanel. *This guide assumes you have a PostgreSQL Database URL ready.*
*   **Structure:** We will put the frontend (what the user sees) on your main domain, and the backend (the server) in a separate folder running via cPanel's Node.js App feature.
*   **Terminal:** While we will build the project on your own computer first (to avoid complex commands on cPanel), we will still need to run a couple of simple commands in the cPanel Terminal to set up the database.

---

## Step 1: Prepare the Files on Your Computer (Local Build)

To avoid errors on the server, it's easiest to "build" (compile) the project on your own computer first.

1.  **Open your terminal/command prompt** on your computer.
2.  **Build the Frontend:**
    *   Navigate to the main folder of the project.
    *   Run this command: `npm install` (Wait for it to finish)
    *   Run this command: `npm run build`
    *   This will create a folder called `dist`. This folder contains your entire frontend ready for the web.
3.  **Build the Backend:**
    *   In your terminal, navigate into the server folder: `cd server`
    *   Run this command: `npm install`
    *   Run this command: `npm run build`
    *   This will create a `dist` folder inside the `server` folder.

## Step 2: Zip the Files for Upload

Now we need to package the files so they are easy to upload.

1.  **Zip the Frontend:**
    *   Go to the main project folder on your computer.
    *   Find the `dist` folder that was just created.
    *   Right-click the `dist` folder and compress/zip it. Name it `frontend.zip`.
2.  **Zip the Backend:**
    *   Go into the `server` folder.
    *   Select the following files and folders:
        *   The `dist` folder (inside the server folder)
        *   The `prisma` folder
        *   `package.json`
        *   `package-lock.json`
    *   Right-click and compress/zip them together. Name it `backend.zip`.

---

## Step 3: Upload to cPanel

1.  Log in to your **cPanel**.
2.  Find and click on **File Manager**.

**A. Upload the Frontend:**
1.  In the File Manager, go to the `public_html` folder (this is where your main website lives).
2.  Click **Upload** at the top and upload your `frontend.zip` file.
3.  Once uploaded, go back to `public_html`, right-click `frontend.zip`, and click **Extract**.
4.  Extract the files directly into `/public_html/`. *(Note: If they extract into a folder called `dist`, move all the files out of the `dist` folder directly into `public_html`).*
5.  **Important for React Router:** Because this app has multiple pages, you need a special file to handle routing.
    *   In `public_html`, click **+ File** at the top left.
    *   Name it `.htaccess` (make sure you include the dot). If you can't see it after creating it, click "Settings" in the top right and check "Show Hidden Files".
    *   Right-click `.htaccess`, click **Edit**, paste the following code, and save:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

**B. Upload the Backend:**
1.  In the File Manager, go to your home directory (one level up from `public_html`, usually looks like `/home/yourusername/`).
2.  Create a new folder here called `drhabibi_backend`. (It is safer to put this *outside* of `public_html`).
3.  Open the `drhabibi_backend` folder.
4.  Click **Upload** and upload your `backend.zip` file.
5.  Right-click `backend.zip` and click **Extract**.

---

## Step 4: Setup the Node.js App in cPanel

1.  Go back to the main cPanel dashboard.
2.  Search for and click on **Setup Node.js App**.
3.  Click **Create Application**.
4.  Fill in the details:
    *   **Node.js version:** Choose the highest available version (e.g., 18 or 20).
    *   **Application mode:** Production
    *   **Application root:** `drhabibi_backend` (the folder you created in Step 3B).
    *   **Application URL:** Select your domain and type `api` in the box next to it (so it looks like `yourdomain.com/api`).
    *   **Application startup file:** `dist/index.js`
5.  Click **Create**.

**Add Environment Variables:**
Scroll down on that same page to the "Environment variables" section. You need to add these by clicking "Add Variable":
*   Name: `PORT`, Value: (Leave blank or whatever port cPanel gives you)
*   Name: `DATABASE_URL`, Value: `your_postgresql_database_connection_url_here`
*   Name: `JWT_SECRET`, Value: `make_up_a_long_random_password_here`
*   Name: `FRONTEND_URL`, Value: `https://yourdomain.com`

*Make sure to click **Save** after adding them.*

---

## Step 5: Install Packages and Setup Database

Now we use the terminal for a few quick commands.

1.  On the "Setup Node.js App" page where you just created the app, look for a section that says "Command for entering to virtual environment" (it will look something like `source /home/username/nodevenv/drhabibi_backend/20/bin/activate`). **Copy that command.**
2.  Go back to the main cPanel dashboard and click on **Terminal**.
3.  Paste the command you just copied and press Enter. Your prompt should change to show you are in the virtual environment.
4.  Run this command to install the backend packages:
    ```bash
    npm install
    ```
5.  Run this command to set up the Prisma client for the database:
    ```bash
    npx prisma generate
    ```
6.  Run this command to push the database structure to your database (Make sure your `DATABASE_URL` was set correctly in Step 4!):
    ```bash
    npx prisma db push
    ```

## Step 6: Restart and Test

1.  Go back to the **Setup Node.js App** page in cPanel.
2.  Find your `drhabibi_backend` app and click the **Restart** button.
3.  Your frontend should now be live at `https://yourdomain.com` and your backend API should be running at `https://yourdomain.com/api`.

**Congratulations! Your project is deployed.**
