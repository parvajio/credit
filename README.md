# 💳 Credit System

A full-stack credit management application with secure authentication, transaction processing, and admin approval workflows.

## ✨ Features

### 🔐 Authentication
- Secure sign-up/login with email/password
- Role-based authorization (User/Admin)
- Protected routes and API endpoints
- Session management with JWT

### 💰 Transactions
- Submit credit transfer requests
- Real-time status tracking (Pending/Approved/Rejected)
- Automatic credit balance updates
- Transaction history with filters

### 👨‍💻 Admin Dashboard
- Approve/reject pending transactions
- View all user transactions
- User management controls
- Audit logs

### 🎨 UI/UX
- Responsive design with Tailwind CSS
- Dark/light mode support
- Form validation with Zod
- Toast notifications
- Loading states

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Shadcn/ui | Component library |
| TanStack Query | Data fetching |
| NextAuth.js | Authentication |

### Backend
| Technology | Purpose |
|------------|---------|
| Drizzle ORM | Database toolkit |
| PostgreSQL | Database |
| Neon | Serverless Postgres |
| Zod | Data validation |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database
- npm/yarn/pnpm
