# Collaborative Task Management App

A collaborative task management application built with Next.js, Supabase, Zustand, and TanStack Query. This app allows multiple users to manage tasks collaboratively, with role-based access control, task assignments, and real-time notifications.

## Features

- **Role-Based Access Control**: Users can have different roles (e.g., viewer, editor, admin) that control their permissions for viewing and editing tasks.
- **Task Assignment**: Users can assign tasks to other users.
- **Real-Time Notifications**: Users receive browser notifications when they are assigned a new task.
- **Optimistic Updates and Data Caching**: Using TanStack Query to improve data loading and state management with optimistic UI updates.
- **Global State Management**: Powered by Zustand to manage global state across components.

## Technologies

- **Next.js**: Framework for server-side rendering and building web applications.
- **Supabase**: Provides authentication, database management, and real-time data syncing.
- **Zustand**: Manages global state across the app.
- **TanStack Query**: Manages data fetching, caching, and synchronization with Supabase.
- **Service Workers**: For background notifications when tasks are assigned.

## Getting Started

### Prerequisites

- **Node.js**: Make sure you have Node.js installed (version 14 or higher).
- **Supabase**: Create a Supabase account and set up a new project.
- **Supabase Database Tables**: Create the following tables in Supabase:

1. **Users** table:
   - `id`: UUID (Primary Key)
   - `email`: String
   - `role`: String (e.g., 'viewer', 'editor', 'admin')

2. **Task** table:
   - `id`: UUID (Primary Key)
   - `name`: String
   - `activity`: String
   - `start_date`: Date
   - `end_date`: Date

3. **User_Task** table (for task assignments):
   - `id`: UUID (Primary Key)
   - `task_id`: Foreign Key to Task
   - `user_id`: Foreign Key to Users
   - `assigned_by`: Foreign Key to Users

### Supabase Setup

1. Copy the Supabase project URL and Anon key from your Supabase dashboard.
2. Enable Row-Level Security (RLS) and set policies for the `Task` and `User_Task` tables based on roles (viewer, editor, admin).

### Installation

1.**Clone the repository:**
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

2.**Install dependencies:**
npm install

3.**Start the development server:**
npm run dev
Open http://localhost:3000 in your browser to view the app.
### Environment Variables

Create a `.env.local` file in the root of your project with the following environment variables:

```plaintext
NEXT_PUBLIC_SUPABASE_URL=<Your Supabase URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Your Supabase Anon Key>

