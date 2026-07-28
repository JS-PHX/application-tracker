# Application Tracker

A full-stack job application tracker built to manage my own job search, with authentication and per-user data storage.

[Live Demo](https://application-tracker-7mgioaauj-js-phxs-projects.vercel.app/)

## Features
- Sign up / log in with email confirmation
- Add, edit, and delete job applications
- Track application status (Applied, Interviewing)
- Each user only sees their own data, enforced at the database level
- Responsive design

## Tech Stack
- React (Vite)
- Supabase (Postgres database, authentication, Row Level Security)
- Deployed on Vercel

## What I Learned
- Building full CRUD functionality with a real backend
- Implementing authentication and understanding session persistence
- Writing and debugging database security policies (RLS)
- Debugging real-world issues: silent permission failures, React state/UI mismatches, deployment configuration

## Screenshots
![Login screen](screenshots/login.png)
![Dashboard view](screenshots/dashboard.png)