# Grocery Store Product Finder PWA

## Overview

A Progressive Web Application (PWA) that helps grocery store shoppers locate products by scanning barcodes or entering EAN codes. The application displays product information including location within the store (aisle and shelf) and provides an interactive store map showing the exact position of items. Built with a focus on mobile-first design, offline functionality, and quick task completion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React with TypeScript for type safety and component-based UI
- Vite as the build tool and development server
- Wouter for lightweight client-side routing

**UI Framework:**
- Shadcn/ui component library (Material Design-inspired components)
- Radix UI primitives for accessible, unstyled component foundations
- Tailwind CSS for utility-first styling with custom design tokens
- Material Design principles for consistent, mobile-optimized patterns

**State Management:**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- React hooks for local component state
- Custom query client with offline-first behavior

**PWA Features:**
- Service Worker (sw.js) implementing cache-first strategy for offline functionality
- Web App Manifest for installability and native-like experience
- Barcode scanning via Html5Qrcode library accessing device camera

**Design System:**
- Custom color system using CSS variables for theming
- Roboto font family for Material Design consistency
- Spacing system based on Tailwind units (2, 4, 6, 8)
- Mobile-first responsive design with thumb-zone optimization

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript for API routes
- Custom middleware for request logging and JSON parsing
- Vite middleware integration for development hot module replacement

**API Design:**
- RESTful endpoints for product and search history operations
- JSON request/response format
- Error handling with structured error messages
- Routes:
  - `GET /api/products/:ean` - Retrieve product by barcode
  - `GET /api/products` - List all products
  - `GET /api/history` - Retrieve search history
  - `POST /api/history` - Add search history entry
  - `DELETE /api/history` - Clear search history

**Data Storage:**
- In-memory storage implementation (MemStorage) for development/demo
- Drizzle ORM configured for PostgreSQL production use
- Schema definitions using Drizzle's type-safe query builder
- Database schema includes:
  - Products table: EAN, name, price, category, aisle, shelf, map coordinates
  - Search history table: EAN, product name, timestamp
  - Users table: username, password (for future authentication)

### Data Layer

**ORM & Schema:**
- Drizzle ORM provides type-safe database operations
- Schema defined in shared/schema.ts for use across client and server
- Zod schemas for runtime validation using drizzle-zod
- PostgreSQL as target database with Neon Database serverless driver

**Data Models:**
- Product: Complete product information with store location and map coordinates (X/Y percentages 0-100)
- SearchHistory: User search tracking with timestamps
- User: Authentication schema (prepared for future use)

**Mock Data:**
- Pre-populated product catalog in MemStorage covering multiple grocery categories
- Products organized by aisles (A1-A4) with realistic pricing and positioning

### Progressive Web App Strategy

**Offline Capability:**
- Service Worker caches essential assets on install
- Network-first strategy for API calls with cache fallback
- Runtime cache for dynamic content
- Visual feedback for online/offline status

**Installability:**
- Web App Manifest defines app metadata, icons, and display mode
- Standalone display mode for app-like experience
- Theme color matching Material Design blue (#1976D2)
- Apple-specific meta tags for iOS installation

**Performance Optimization:**
- Lazy loading for barcode scanner library
- Asset preloading and font optimization
- Vite code splitting and tree shaking
- Minimal JavaScript bundle for fast initial load

### Development Architecture

**TypeScript Configuration:**
- Strict mode enabled for type safety
- Path aliases for clean imports (@/, @shared/, @assets/)
- ESNext module system with bundler resolution
- Shared types between client and server

**Development Tools:**
- TSX for running TypeScript server code directly
- Vite dev server with HMR for instant feedback
- ESBuild for production bundling
- Replit-specific plugins for development environment integration

## External Dependencies

### Core Dependencies

**UI & Styling:**
- Radix UI component primitives (@radix-ui/*) - Accessible, unstyled UI components
- class-variance-authority - Type-safe component variants
- clsx & tailwind-merge - Utility class composition
- Tailwind CSS - Utility-first CSS framework
- Roboto & Roboto Mono fonts (Google Fonts) - Material Design typography

**State & Data Management:**
- @tanstack/react-query - Server state management and caching
- React Hook Form (@hookform/resolvers) - Form validation
- Zod - Runtime schema validation

**Hardware Integration:**
- html5-qrcode - Camera access and barcode scanning functionality

**Database & ORM:**
- Drizzle ORM - Type-safe SQL query builder
- @neondatabase/serverless - Serverless PostgreSQL driver for production
- drizzle-zod - Generate Zod schemas from Drizzle tables
- connect-pg-simple - PostgreSQL session store (prepared for future authentication)

**Server Framework:**
- Express.js - Web server and API routing
- Vite - Build tool and development server with middleware mode

**Utility Libraries:**
- date-fns - Date manipulation and formatting
- wouter - Lightweight routing for React
- nanoid - Unique ID generation

### Development Dependencies

**Build & Development:**
- TypeScript - Type checking and compilation
- Vite plugins for Replit integration (cartographer, dev-banner, runtime-error-modal)
- ESBuild - Fast JavaScript bundler for production

### Database Configuration

**PostgreSQL Setup:**
- Database URL required via DATABASE_URL environment variable
- Drizzle Kit for schema migrations and database management
- Migration files output to ./migrations directory
- Schema source in shared/schema.ts for type sharing

### Service Integrations

**PWA Services:**
- Service Worker API for offline caching
- Camera API for barcode scanning
- Web App Manifest for installation
- LocalStorage for potential offline data persistence

**Font Services:**
- Google Fonts CDN for Roboto font family delivery
- Preconnect hints for performance optimization