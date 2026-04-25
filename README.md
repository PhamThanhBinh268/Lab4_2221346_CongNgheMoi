# Simple Blog - Full-stack Next.js & Supabase Project

Welcome to the **Simple Blog** project! This is a modern, full-stack blogging platform built with **Next.js 16 (App Router)** and **Supabase**. It features a beautifully designed public interface, a fully functional Admin Dashboard, Role-Based Access Control (RBAC), and real-time comments.

## 🚀 Features
- **Modern UI**: Designed with Tailwind CSS and shadcn/ui, featuring a vibrant, content-first layout.
- **Admin Dashboard**: Manage posts, categories, and view blog statistics in a dedicated, secure dashboard.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `admin` and `user` roles.
- **Categories**: Organize your content into topics.
- **Real-time Comments**: Instant comment updates using Supabase Realtime Channels.
- **Mock Data Seeding**: Automatically populate your database with sample categories and posts for testing.

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (React, App Router, Server Actions)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, GoTrue, Row Level Security)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 💻 Environment Setup Guide

Follow these steps to get the project running on your local machine.

### 1. Prerequisites
- **Node.js**: v18.0 or newer (v20+ recommended).
- **npm**: Standard Node package manager.
- **Supabase Account**: Create a free account at [supabase.com](https://supabase.com/).

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/SangIT2004/Lab04_Use_GeminiCLI_Blog.git
cd Lab04_Use_GeminiCLI_Blog/simple-blog
npm install
```

### 3. Supabase Project Setup
1. Log in to [Supabase](https://supabase.com/) and create a **New Project**.
2. Wait a few minutes for the database to provision.
3. In the Supabase Dashboard, go to **SQL Editor**.
4. You need to execute the SQL scripts included in this repository to set up the database schema, policies, and roles. Run the following scripts **in order**:
   - Copy the content of `supabase_setup.sql` and run it.
   - Run `CREATE EXTENSION IF NOT EXISTS unaccent;` (to support Vietnamese slug generation).
   - Copy the content of `supabase_update_v2.sql` and run it.
   - Copy the content of `supabase_update_v3_role.sql` and run it.
   - Copy the content of `supabase_update_v4_categories.sql` and run it.

### 4. Environment Variables
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
2. Go to your Supabase Dashboard -> **Project Settings** (gear icon) -> **API**.
3. Copy the **Project URL** and the **anon public key**.
4. Open `.env` and fill in your details:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_actual_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👑 Admin Configuration & Seeding Data

By default, any new account created via the `/register` page will be assigned the `user` role. Users can only read posts and leave comments.

**To access the Admin Dashboard (`/dashboard`)**:
1. Go to your Supabase Dashboard -> **Table Editor** -> `profiles`.
2. Find your user row and change the `role` column from `user` to `admin`.
3. Go back to your local app and navigate to `/dashboard`.

**To seed sample data**:
1. Once inside the Admin Dashboard, go to the **Statistics** page.
2. Click the **"Tạo bài viết mẫu" (Seed Data)** button in the top right corner.
3. This will automatically generate categories and sample posts for you to test the UI!

---

## 📜 License
This project is for educational purposes. Feel free to use it, learn from it, and expand upon it!
