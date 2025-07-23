# Express TypeScript Starter

A robust starter template for building Node.js applications with Express and TypeScript. This project provides a solid foundation with best practices for building scalable backend services.

## Features

- **TypeScript Support**: Full TypeScript integration with path aliases
- **Express Framework**: Fast, unopinionated, minimalist web framework for Node.js
- **Advanced Logging**: Structured logging with Winston and Morgan
- **Environment Configuration**: Secure environment variable management
- **Drizzle ORM**: Type-safe database operations with schema management
- **PostgreSQL Integration**: Ready-to-use PostgreSQL database connection
- **Authentication Routes**: Boilerplate for auth flows (login, register, etc.)
- **Modular Architecture**: Each module can have its own schema definition
- **Repository Pattern**: Clean data access layer with reusable base repository
- **API Structure**: Clean and organized API structure
- **Production Ready**: Configuration for development and production environments
- **CORS Support**: Cross-Origin Resource Sharing enabled

## Prerequisites

- Node.js (v16 or higher)
- pnpm
- PostgreSQL

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd express-ts-starter
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
# Alternatively, you can use a connection string
# DB_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_jwt_secret
ENCRYPTION_SECRET=your_encryption_secret
# Optional SMTP config
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

### 4. Start the development server

```bash
pnpm dev
```

Your server will be running at `http://localhost:3000`.

### 5. Database Setup

Generate migrations for your database schemas:

```bash
pnpm db:generate
```

Apply the migrations to your database:

```bash
pnpm db:migrate
```

You can also explore your database with Drizzle Studio:

```bash
pnpm db:studio
```

## Project Structure

```
express-ts-starter/
├── src/
│   ├── auth/            # Authentication related code
│   │   ├── auth.router.ts
│   │   └── auth.schema.ts   # Auth-specific database schema
│   ├── common/          # Common utilities and middleware
│   ├── config/          # Application configuration
│   ├── database/        # Database connection and utilities
│   │   ├── schema/      # Base schema definitions
│   │   ├── db.ts        # Database connection
│   │   ├── index.ts     # Database module exports
│   │   ├── migrate.ts   # Migration utility
│   │   └── repository.ts # Base repository pattern
│   ├── file/            # File handling logic
│   ├── mail/            # Email services
│   ├── user/            # User module
│   │   ├── user.schema.ts   # User-specific database schema
│   │   └── user.repository.ts # User-specific repositories
│   ├── utils/           # Utility functions
│   ├── app.router.ts    # Main router configuration
│   ├── app.ts           # Express application setup
│   ├── server.ts        # Server entry point
│   └── types.d.ts       # TypeScript type definitions
├── drizzle/             # Database migrations
├── logs/                # Application logs
├── .env                 # Environment variables (create this)
├── .gitignore           # Git ignore file
├── drizzle.config.ts    # Drizzle ORM configuration
├── package.json         # Project dependencies and scripts
├── pnpm-lock.yaml       # Lock file for dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

## Available Scripts

- `pnpm dev`: Start the development server with hot reloading
- `pnpm build`: Build the application for production
- `pnpm start`: Start the production server
- `pnpm db:generate`: Generate database migrations from your schema
- `pnpm db:push`: Push schema changes directly to the database (development)
- `pnpm db:studio`: Launch Drizzle Studio to manage your database
- `pnpm db:migrate`: Run all pending migrations

## API Endpoints

### Health Check
- `GET /api/health`: Check if the API is running

### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/logout`: User logout
- `POST /api/auth/refresh`: Refresh authentication token
- `POST /api/auth/forgot-password`: Password recovery request
- `POST /api/auth/reset-password`: Reset password with token
- `POST /api/auth/verify-email`: Verify user email

## Path Aliases

This project uses TypeScript path aliases for cleaner imports. The main alias is:

- `@/*`: Points to the `src/` directory

Usage example:
```typescript
import config from '@/config';
import { logger } from '@/utils/logger';
```

## Logging

The application uses Winston for logging with the following levels:
- error: For error messages
- warn: For warning messages
- http: For HTTP request logs
- info: For informational messages
- debug: For debug messages

Logs are stored in the `logs/app.log` file and also displayed in the console.

## Database Structure

This project uses Drizzle ORM with a modular architecture:

### Schema Organization

Each module can have its own schema file (e.g., `auth.schema.ts`, `user.schema.ts`) that defines the database tables and relationships for that module. 

Example schema file:
```typescript
// src/user/user.schema.ts
import { pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { createBaseTable } from '@/database/schema/base';

export const userProfiles = createBaseTable('user_profiles').extend({
  userId: text('user_id').notNull().references(() => users.id),
  bio: text('bio'),
  // ... other fields
});

// Export types for type safety
export type UserProfile = SelectType<typeof userProfiles>;
export type NewUserProfile = InsertType<typeof userProfiles>;
```

### Repository Pattern

The starter includes a base repository that provides CRUD operations:

```typescript
// Example repository usage
import { userProfileRepository } from '@/user/user.repository';

// Find all profiles
const profiles = await userProfileRepository.findAll();

// Find by ID
const profile = await userProfileRepository.findById('123');

// Create new profile
const newProfile = await userProfileRepository.create({
  userId: '123',
  bio: 'Hello world'
});
```

### Database Migrations

The project includes utilities for generating and running migrations:

1. Make changes to your schema files
2. Generate migrations: `pnpm db:generate`
3. Apply migrations: `pnpm db:migrate`

## Deployment

To deploy this application:

1. Build the project:
```bash
pnpm build
```

2. Set up your environment variables on your server
3. Start the application:
```bash
pnpm start
```

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.