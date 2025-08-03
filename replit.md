# Overview

KeySentinel is a secure API key proxy and monitoring platform designed for developers. It provides a secure way to wrap real API keys (like Gemini or OpenAI) and issue scoped "Sentinel Keys" with fine-grained access controls. The platform features a dashboard for key management, real-time analytics, and comprehensive security monitoring with anomaly detection and instant alerts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Comprehensive component library built on Radix UI primitives with shadcn/ui styling patterns
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management and caching
- **Animations**: Framer Motion for smooth animations and transitions
- **Design System**: Custom color palette with navy, coral, and sky themes, glassmorphism effects

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with structured route handlers
- **Development**: Hot reload with Vite middleware integration
- **Build**: esbuild for server-side bundling, separate from client build

## Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Connection**: Neon Database serverless PostgreSQL
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Modeling**: Comprehensive schema with users, API keys, sentinel keys, usage logs, trusted users, and alerts
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Authentication and Authorization
- **Session Management**: PostgreSQL-based session storage using connect-pg-simple
- **Access Control**: Role-based access with owner-based resource isolation
- **Security**: Encrypted API key storage, scoped access controls, IP restrictions

## Key Features Implementation
- **Vault System**: Encrypted storage of real API keys with provider categorization
- **Sentinel Key Management**: Proxy key generation with rate limiting, endpoint restrictions, and expiration
- **Usage Monitoring**: Comprehensive logging with IP tracking, performance metrics, and analytics
- **Security Monitoring**: Real-time threat detection, alert system, and audit trails
- **Dashboard Analytics**: Interactive charts, usage statistics, and security status indicators

# External Dependencies

## Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, TypeScript support
- **Build Tools**: Vite, esbuild, PostCSS with Autoprefixer
- **Development**: tsx for TypeScript execution, Replit development integration

## UI and Styling
- **Component Library**: Extensive Radix UI primitives collection
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Animations**: Framer Motion, Embla Carousel for carousels
- **Utilities**: clsx for conditional classes, date-fns for date handling

## Backend and Database
- **Database**: Neon Database serverless PostgreSQL
- **ORM**: Drizzle ORM with Zod integration for type-safe database operations
- **Session**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod schemas for runtime type validation

## Development and Tooling
- **Package Management**: npm with lock file for reproducible builds
- **Type Checking**: TypeScript with strict configuration
- **Path Resolution**: Custom path aliases for clean imports
- **Runtime**: Node.js with ES modules support

## API Integration
- **HTTP Client**: Fetch API with TanStack Query for caching
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Command Interface**: cmdk for command palette functionality

The architecture prioritizes security, developer experience, and scalability while maintaining a clean separation between client and server concerns. The modular design allows for easy extension and maintenance of the codebase.