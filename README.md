# ComeBookUs - SaaS Appointment Management Platform

ComeBookUs is a comprehensive SaaS application designed for solo entrepreneurs (freelancers like hairdressers, coaches, therapists, etc.) to manage their appointments, accept payments, and grow their business.

## 🏗️ Architecture

This project is organized using a **modular monorepo architecture** with clear separation of concerns:

```
comebookus/
├── backend/           # API server & business logic
├── frontend/          # User interface & client-side logic  
├── database/          # Database schema & migrations
├── shared/            # Shared types, constants & utilities
└── docs/              # Documentation
```

## 📁 Project Structure

### 🔧 Backend (`/backend`)
**Responsibility**: API endpoints, business logic, authentication, external integrations

```
backend/
├── src/
│   ├── api/           # Next.js API routes
│   │   ├── bookings/  # Booking management endpoints
│   │   ├── services/  # Service management endpoints
│   │   ├── dashboard/ # Analytics endpoints
│   │   ├── public/    # Public booking pages API
│   │   └── webhooks/  # External service webhooks
│   ├── lib/           # Core libraries & utilities
│   │   ├── prisma.ts  # Database client
│   │   ├── stripe.ts  # Payment processing
│   │   ├── supabase.ts# Authentication
│   │   └── notifications.ts # Email/SMS services
│   ├── services/      # Business logic services
│   ├── middleware/    # Request middleware
│   └── types/         # Backend-specific types
├── package.json       # Backend dependencies
└── tsconfig.json      # TypeScript configuration
```

### 🎨 Frontend (`/frontend`)
**Responsibility**: User interface, React components, client-side logic

```
frontend/
├── src/
│   ├── app/           # Next.js App Router pages
│   │   ├── dashboard/ # Dashboard pages
│   │   ├── book/      # Public booking pages
│   │   ├── layout.tsx # Root layout
│   │   └── page.tsx   # Landing page
│   ├── components/    # Reusable UI components
│   │   ├── ui/        # Base UI components
│   │   ├── calendar/  # Calendar components
│   │   ├── booking/   # Booking-related components
│   │   └── dashboard/ # Dashboard components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Frontend utilities
│   └── styles/        # CSS styles
├── public/            # Static assets
├── package.json       # Frontend dependencies
├── next.config.js     # Next.js configuration
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

### 🗄️ Database (`/database`)
**Responsibility**: Database schema, migrations, seeds, database scripts

```
database/
├── prisma/
│   ├── schema.prisma  # Database schema definition
│   └── migrations/    # Database migrations
├── seeds/             # Database seed files
├── scripts/           # Database utility scripts
└── package.json       # Database dependencies
```

### 🔄 Shared (`/shared`)
**Responsibility**: Shared types, constants, utilities used across modules

```
shared/
├── types/             # TypeScript type definitions
│   ├── user.ts        # User-related types
│   ├── booking.ts     # Booking-related types
│   ├── service.ts     # Service-related types
│   └── index.ts       # Type exports
├── constants/         # Application constants
└── utils/             # Shared utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd comebookus
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Environment Setup**
Copy `.env.example` to `.env.local` in the root directory and configure your environment variables.

4. **Database Setup**
```bash
npm run db:generate
npm run db:push
```

5. **Start Development Servers**
```bash
npm run dev
```

This will start both backend (port 3001) and frontend (port 3000) servers concurrently.

## 📜 Available Scripts

### Development
- `npm run dev` - Start both backend and frontend in development mode
- `npm run dev:backend` - Start only backend server (port 3001)
- `npm run dev:frontend` - Start only frontend server (port 3000)

### Building
- `npm run build` - Build all modules for production
- `npm run build:backend` - Build backend only
- `npm run build:frontend` - Build frontend only

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Quality Assurance
- `npm run lint` - Lint all modules
- `npm run type-check` - Type check all modules

### Utilities
- `npm run clean` - Clean all node_modules and build artifacts
- `npm run install:all` - Install dependencies for all modules

## 🔧 Tech Stack

### Backend
- **Next.js 14** - API routes and server-side logic
- **Prisma** - Database ORM and migrations
- **Supabase** - Authentication and PostgreSQL database
- **Stripe** - Payment processing
- **Resend** - Email notifications
- **Twilio** - SMS notifications

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Icon library

### Database
- **PostgreSQL** - Primary database
- **Prisma** - Database toolkit and ORM

## 🌟 Key Features

- **📅 Interactive Calendar** - Manage appointments with intuitive calendar view
- **🔗 Public Booking Pages** - Personalized booking links for clients
- **💳 Payment Processing** - Secure payments via Stripe
- **📧 Smart Notifications** - Automated email and SMS confirmations & reminders
- **⏰ 24-Hour Reminders** - Automated reminder system via cron jobs
- **📊 Analytics Dashboard** - Business performance insights
- **⚙️ Service Management** - Multiple services with custom pricing
- **👥 Client Management** - Track client information and history
- **🔔 Notification Preferences** - User-controlled email/SMS settings

## 🚀 Deployment

### Vercel (Recommended)

1. **Frontend Deployment**
```bash
cd frontend
vercel
```

2. **Backend Deployment**
```bash
cd backend  
vercel
```

### Environment Variables
Ensure all environment variables are configured in your deployment platform:
- Database connection strings
- Supabase keys
- Stripe keys
- Email/SMS service credentials

## 🔒 Security

- **Authentication** - Supabase Auth with JWT tokens
- **API Protection** - Authenticated endpoints
- **Payment Security** - PCI-compliant Stripe integration
- **Data Validation** - Server-side input validation
- **CORS Configuration** - Proper cross-origin settings

## 🧪 Testing

```bash
# Run tests for all modules
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📈 Performance

- **Next.js Optimizations** - App Router, Server Components
- **Database Indexing** - Optimized queries with Prisma
- **Caching Strategy** - API response caching
- **Image Optimization** - Next.js image optimization
- **Code Splitting** - Automatic code splitting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes in the appropriate module
4. Run tests and type checking
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@comebookus.com
- 📖 Documentation: [docs.comebookus.com](https://docs.comebookus.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/comebookus/issues)

---

Built with ❤️ for solo entrepreneurs who want to focus on their business, not booking management.
