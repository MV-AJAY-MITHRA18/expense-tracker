Expense Tracker App

A mobile expense tracking application built with Expo and React Native (Mobile) and Express/Postgres (Backend).

Setup

1. Mobile App Setup (Pavan's Part)

Navigate to the mobile folder.

Run npm install (to install dependencies including Clerk Expo and Navigation).

Run npx expo start to launch the mobile development server.

2. Backend API Setup (Ajay's Part)

Navigate to the backend folder.

Run npm install (to install Express, pg, ioredis, Clerk SDK, and nodemon).

Ensure the database table is created (by running the SQL migration).

Run npm run dev to start the API server on http://localhost:5001.

Project Structure

mobile/: All source code for the React Native/Expo application.

backend/: The Express.js API server, PostgreSQL connection, and middleware.

Features

Add, edit, and delete expenses

Track daily, weekly, and monthly spending

Simple and intuitive UI

Tech Stack

React Native

Expo

JavaScript (ES6)

Express.js

PostgreSQL (via Neon)

Redis (for rate limiting)

Clerk (for authentication)

Reset Project (optional)

To reset and start with a fresh app structure (Mobile only):

npm run reset-project


License

This project is open-source under the MIT License.