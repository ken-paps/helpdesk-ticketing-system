# HelpDesk Ticketing System

A full-stack, enterprise-grade helpdesk ticketing system. 

## 🚀 Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (v4)
- React Query (TanStack)
- React Router DOM
- Axios

**Backend:**
- Node.js & Express
- TypeScript
- Prisma ORM
- MySQL
- JWT Authentication (HttpOnly Cookies)
- Zod (Validation)

## ✨ Features
- **Role-Based Access Control:** Users, Agents, and Admins.
- **Ticketing System:** Create tickets, view details, and add comments.
- **Staff Controls:** Agents/Admins can change ticket statuses and assign tickets.
- **Admin Dashboard:** Admins can add, promote, or delete users.
- **Modern UI:** Fully responsive dark/light mode using Tailwind CSS.

## 🛠️ Local Setup

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/ken-paps/helpdesk-ticketing-system.git
cd helpdesk
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend` folder:
\`\`\`env
DATABASE_URL="mysql://root:password@localhost:3306/helpdesk_db"
PORT=4000
NODE_ENV=development
JWT_ACCESS_SECRET="your_super_secret_access_key"
JWT_REFRESH_SECRET="your_super_secret_refresh_key"
CLIENT_ORIGIN="http://localhost:5173"
\`\`\`
Run migrations and start the server:
\`\`\`bash
npx prisma migrate dev
npx prisma db seed
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd ../frontend
npm install
\`\`\`
Create a `.env` file in the `frontend` folder:
\`\`\`env
VITE_API_URL="http://localhost:4000/api"
\`\`\`
Start the frontend:
\`\`\`bash
npm run dev
\`\`\`

### 4. Default Login (from Seed)
- **Admin:** admin@helpdesk.dev / Password123!
- **Agent:** agent@helpdesk.dev / Password123!
