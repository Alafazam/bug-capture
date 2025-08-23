# Cursor AI Prompt: Complete Frontend Application Boilerplate Setup

## Project Setup Instructions


I want you to create a complete Next.js 15 frontend application boilerplate with modern tech stack that can be reused for any mini frontend projects. Please set up everything step by step, creating all necessary files and configurations.

create all the files in the src folder.
plan the project structure and create the files.
create tasks for each file.
manage the project with taks and mark taks as done.

### Tech Stack Requirements:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn-ui (comprehensive component library)
- **Authentication**: NextAuth.js v5 (with providers setup)
- **Database**: Prisma ORM (with SQLite for development, PostgreSQL production ready)
- **Schema Validations**: Zod
- **State Management**: Zustand
- **Search params state manager**: Nuqs
- **Tables**: Tanstack Data Tables
- **Forms**: React Hook Form
- **Charts**: Recharts
- **Data Processing**: Papaparse (CSV), Lodash
- **API**: Next.js API routes with validation
- **Testing**: Jest + Testing Library
- **Linting**: ESLint (strict)
- **Pre-commit Hooks**: Husky
- **Formatting**: Prettier
- **Deployment**: Vercel/Docker configurations

### Project Structure:
```
frontend-boilerplate/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/page.tsx       # Sample dashboard
│   │   │   ├── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── users/route.ts
│   │   │   └── upload/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                     # Landing page
│   ├── components/
│   │   ├── ui/                          # Shadcn components
│   │   ├── auth/                        # Authentication components
│   │   ├── layouts/                     # Layout components
│   │   ├── data-display/               # Charts, tables, metrics
│   │   ├── forms/                       # Form components
│   │   ├── navigation/                  # Navigation components
│   │   └── common/                      # Shared components
│   ├── lib/
│   │   ├── auth/                        # Auth configuration
│   │   ├── db/                          # Database utilities
│   │   ├── stores/                      # Zustand stores
│   │   ├── schemas/                     # Zod schemas
│   │   ├── utils/                       # Utility functions
│   │   ├── validations/                 # API validations
│   │   └── constants/                   # Constants
│   ├── hooks/                           # Custom hooks
│   ├── types/                           # TypeScript types
│   └── __tests__/                       # Test files
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
├── .env.example
├── .env.local
├── .eslintrc.js
├── .prettierrc
├── jest.config.js
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Setup Steps:

#### 1. Initialize Project
```bash
npx create-next-app@15 frontend-boilerplate --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd frontend-boilerplate
```

#### 2. Install All Dependencies
```bash
# Core dependencies
npm install zustand nuqs @tanstack/react-table @hookform/react-hook-form zod recharts papaparse lodash

# Authentication
npm install next-auth@beta bcryptjs

# Database
npm install prisma @prisma/client

# API & Validation
npm install @hookform/resolvers

# Type definitions
npm install -D @types/papaparse @types/lodash @types/bcryptjs

# Development & Testing tools
npm install -D prettier husky lint-staged jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom

# Shadcn-ui setup
npx shadcn-ui@latest init --yes
```

#### 3. Install All Shadcn Components + Examples
```bash
# Essential UI components
npx shadcn-ui@latest add card tabs input button label select checkbox radio-group table badge sheet accordion alert tooltip progress slider switch calendar dialog popover separator scroll-area form textarea

# Advanced components from examples
npx shadcn-ui@latest add data-table date-picker command dropdown-menu navigation-menu sidebar breadcrumb avatar skeleton

# Chart and visualization components
npx shadcn-ui@latest add chart
```

#### 4. Database Setup (Prisma)
```bash
npx prisma init
npx prisma generate
```

#### 5. Configuration Files Setup

Create comprehensive configuration files:

**prisma/schema.prisma** - Database schema with User, Session, Account models
**next-auth.config.ts** - Authentication configuration
**tailwind.config.js** - Extended with custom utilities and animations
**tsconfig.json** - Strict TypeScript with path mappings
**.eslintrc.js** - Comprehensive ESLint rules for React, TypeScript, Next.js
**.prettierrc** - Consistent formatting rules
**next.config.js** - Next.js optimizations and environment configurations
**jest.config.js** - Testing configuration
**docker-compose.yml** - Local development database
**Dockerfile** - Production deployment

#### 6. Environment Configuration

Create **.env.example** and **.env.local** with:
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
DIRECT_URL="postgresql://user:password@localhost:5432/mydb"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# App Configuration
NODE_ENV="development"
```

#### 7. Create Authentication System

Setup complete authentication with:
- NextAuth.js v5 configuration
- Login/Register pages with form validation
- Protected routes middleware
- Session management
- OAuth providers (Google, GitHub)
- Database session storage

#### 8. Create Base Store Structure (Zustand)

Create modular stores for:
```typescript
// Global app state
interface AppStore {
  user: User | null
  theme: 'light' | 'dark'
  isLoading: boolean
  setUser: (user: User | null) => void
  toggleTheme: () => void
}

// UI state management
interface UIStore {
  sidebarOpen: boolean
  modals: ModalState
  notifications: Notification[]
  toggleSidebar: () => void
  openModal: (modal: string) => void
  addNotification: (notification: Notification) => void
}

// Data state (generic for any project)
interface DataStore<T> {
  items: T[]
  filters: Record<string, any>
  pagination: PaginationState
  isLoading: boolean
  error: string | null
  setItems: (items: T[]) => void
  updateFilters: (filters: Partial<Record<string, any>>) => void
}
```

#### 9. Create Schema Definitions (Zod)

Create reusable schemas:
```typescript
// User schemas
const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN'])
})

// Form schemas
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// API schemas
const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional()
})

// File upload schemas
const FileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['csv', 'json', 'image']),
  maxSize: z.number().default(5 * 1024 * 1024) // 5MB
})
```

#### 10. Create Comprehensive Utility Functions

Setup utilities for:
```typescript
// Date/time utilities
export const formatDate = (date: Date, format?: string) => {}
export const isValidDate = (date: string) => {}

// Data processing utilities
export const processCSV = async (file: File) => {}
export const exportToCSV = (data: any[], filename: string) => {}
export const groupBy = <T>(array: T[], key: keyof T) => {}

// API utilities
export const apiClient = {
  get: <T>(url: string) => Promise<T>
  post: <T>(url: string, data: any) => Promise<T>
  put: <T>(url: string, data: any) => Promise<T>
  delete: <T>(url: string) => Promise<T>
}

// Formatting utilities
export const formatNumber = (num: number, options?: {}) => {}
export const formatCurrency = (amount: number, currency?: string) => {}
export const truncateText = (text: string, length: number) => {}

// Validation utilities
export const validateFile = (file: File, schema: z.ZodSchema) => {}
export const sanitizeInput = (input: string) => {}
```

#### 11. Create Base Components Library

Setup reusable components:

**Layout Components:**
- AppLayout (with sidebar, header, footer)
- DashboardLayout (for authenticated pages)
- AuthLayout (for login/register pages)
- LandingLayout (for marketing pages)

**Form Components:**
- FormField wrapper with error handling
- FileUpload with drag-and-drop
- SearchInput with debounced search
- DateRangePicker
- MultiSelect component

**Data Display Components:**
- DataTable with sorting, filtering, pagination
- Charts wrapper components (Line, Bar, Pie, Area)
- MetricCard for displaying KPIs
- EmptyState component
- LoadingSpinner and Skeleton components

**Navigation Components:**
- Sidebar with collapsible sections
- Breadcrumbs
- Pagination
- Tabs with URL synchronization

#### 12. Create API Routes

Setup API structure:
```typescript
// /api/auth/[...nextauth]/route.ts - NextAuth configuration
// /api/users/route.ts - User CRUD operations
// /api/upload/route.ts - File upload handling
// /api/data/route.ts - Generic data operations

// Middleware for API validation
export const withAuth = (handler: NextApiHandler) => {}
export const withValidation = (schema: z.ZodSchema) => (handler: NextApiHandler) => {}
```

#### 13. Database Models

Create Prisma models:
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(USER)
  accounts  Account[]
  sessions  Session[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  // NextAuth account model
}

model Session {
  // NextAuth session model
}

enum Role {
  USER
  ADMIN
}
```

#### 14. Setup Testing Framework

Configure Jest with:
- Component testing utilities
- API route testing
- Database testing with test containers
- Mock utilities for external services

#### 15. Create Sample Pages

Build example pages:
- **Landing page** with hero section and features
- **Dashboard page** with sample charts and metrics
- **Settings page** with user profile management
- **Data page** with table and filters
- **Upload page** with file processing

#### 16. Setup Development Tools

Configure:
```json
// package.json scripts
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "lint:fix": "next lint --fix",
  "format": "prettier --write .",
  "test": "jest",
  "test:watch": "jest --watch",
  "db:push": "prisma db push",
  "db:migrate": "prisma migrate dev",
  "db:seed": "tsx prisma/seed.ts"
}
```

#### 17. Docker Configuration

Create Docker setup:
```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS base
# ... Docker configuration
```

```yaml
# docker-compose.yml for local development
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
```

### Specific Implementation Requirements:

#### Global State Management (Zustand):
```typescript
// App Store - Global application state
interface AppStore {
  user: User | null
  theme: 'light' | 'dark' | 'system'
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// UI Store - Interface state management
interface UIStore {
  sidebarOpen: boolean
  modals: Record<string, boolean>
  notifications: Notification[]
  toggleSidebar: () => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

// Generic Data Store - Reusable for any data type
interface DataStore<T> {
  items: T[]
  filteredItems: T[]
  filters: Record<string, any>
  sortConfig: SortConfig
  pagination: PaginationState
  isLoading: boolean
  error: string | null
  setItems: (items: T[]) => void
  setFilters: (filters: Record<string, any>) => void
  setSorting: (config: SortConfig) => void
  setPagination: (pagination: Partial<PaginationState>) => void
}
```

#### Authentication Schema (Zod):
```typescript
const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

const UserProfileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional()
})
```

#### API Response Schema (Zod):
```typescript
const ApiResponseSchema = <T>(dataSchema: z.ZodSchema<T>) => z.object({
  success: z.boolean(),
  data: dataSchema.optional(),
  error: z.string().optional(),
  message: z.string().optional()
})

const PaginatedResponseSchema = <T>(itemSchema: z.ZodSchema<T>) => z.object({
  items: z.array(itemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number()
  })
})
```

#### URL State Management (Nuqs):
Setup searchParams for common patterns:
```typescript
// Filters and search
const useSearchParams = () => {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' })
  const [page, setPage] = useQueryState('page', { defaultValue: 1, parse: parseInt })
  const [limit, setLimit] = useQueryState('limit', { defaultValue: 10, parse: parseInt })
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: '' })
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', { defaultValue: 'asc' })
  
  return {
    search, setSearch,
    page, setPage,
    limit, setLimit,
    sortBy, setSortBy,
    sortOrder, setSortOrder
  }
}
```

### Sample Pages Implementation:

#### Landing Page Features:
- Hero section with call-to-action
- Feature showcase
- Testimonials section
- Pricing cards (if applicable)
- Contact form
- Responsive design with animations

#### Dashboard Page Features:
- Overview metrics cards
- Sample charts (revenue, user growth, etc.)
- Recent activities table
- Quick actions panel
- Responsive grid layout
- Real-time data updates

#### Data Management Page:
- File upload with drag-and-drop
- Data table with advanced filtering
- Export functionality
- Bulk operations
- Search and pagination
- Column visibility controls

### Additional Requirements:

1. **Theme System**: Complete dark/light mode with system preference
2. **Responsive Design**: Mobile-first approach with breakpoint utilities
3. **Error Boundaries**: Comprehensive error handling with recovery options
4. **Loading States**: Skeleton loaders, spinners, and progress indicators
5. **Form Validation**: Real-time validation with user-friendly error messages
6. **File Handling**: Upload, validation, processing, and export utilities
7. **Internationalization Ready**: i18n setup for multi-language support
8. **SEO Optimized**: Meta tags, structured data, and OpenGraph setup
9. **Performance**: Code splitting, lazy loading, and optimization
10. **Security**: Input sanitization, CSRF protection, and secure headers

### Testing Strategy:
```typescript
// Component testing example
describe('DataTable Component', () => {
  it('renders with data correctly', () => {})
  it('handles sorting interactions', () => {})
  it('filters data based on input', () => {})
})

// API route testing example  
describe('/api/users', () => {
  it('creates user with valid data', () => {})
  it('validates input schema', () => {})
  it('handles authentication', () => {})
})

// Integration testing
describe('User Registration Flow', () => {
  it('completes full registration process', () => {})
})
```

### Deployment Configurations:

#### Vercel Deployment:
- vercel.json configuration
- Environment variables setup
- Edge functions if needed
- Performance monitoring

#### Docker Deployment:
- Multi-stage Dockerfile
- docker-compose for full stack
- Health checks and monitoring
- Production optimizations

### Documentation Requirements:

Create comprehensive documentation:
1. **README.md** - Setup and getting started guide
2. **CONTRIBUTING.md** - Development guidelines
3. **API.md** - API documentation
4. **DEPLOYMENT.md** - Deployment instructions
5. **ARCHITECTURE.md** - System architecture overview

### Post-Setup Verification:

After completing the setup, ensure:
1. All dependencies install without conflicts
2. Development server starts successfully
3. Authentication flow works end-to-end
4. Database connection and migrations work
5. Tests pass successfully
6. Build process completes without errors
7. All example pages render correctly
8. API routes respond as expected

Please create this entire boilerplate systematically, ensuring each component integrates seamlessly with others. Focus on creating a production-ready foundation that demonstrates best practices and can be easily extended for various frontend projects.

The goal is to have a robust starting point that includes authentication, database integration, modern UI components, comprehensive state management, and proper development tooling - ready for immediate use in any new frontend project.