# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Install dependencies
yarn

# Development server (http://localhost:3000)
yarn dev

# Build for production
yarn build

# Export static site to /dist
yarn export

# Run all tests
yarn test

# Run unit tests only (*.spec.ts/tsx files)
yarn unit-test

# Run integration tests only (in __tests__ directories)
yarn integration-test

# Run a single test file
npx jest path/to/test.spec.ts

# Lint code
yarn lint

# Start production server
yarn start
```

## High-Level Architecture

### Data Flow Pattern

The application follows a layered architecture with data flowing from Firebase/API through services to custom hooks to React components:

```
Firebase/API → Service Layer → Custom Hooks → React Components
     ↕                                              ↕
IndexedDB (offline storage) ←→ Unpublished Updates
```

### Key Architectural Components

1. **Service Layer** (`/common/services/`)
   - `firestore/` - ReactFire hooks for real-time Firestore data
   - `api/` - REST API clients with authentication
   - `indexedDB/` - Offline storage using Dexie

2. **Custom Hooks** (`/common/hooks/`)
   - Wrap services with React state management
   - Return standardized structure: `{ status, error, data, handlers, memo }`
   - Handle loading states and error conditions

3. **Feature Modules** (`/features/`)
   - Self-contained business logic units
   - Each feature has its own hooks, components, and styles
   - Follow MVC-like pattern with index.tsx as controller

4. **Model Layer** (`/common/models/`)
   - TypeScript interfaces and types
   - Custom error classes in `errors/`
   - Nested models for complex data structures

### Authentication & Authorization

- Firebase Auth provides JWT tokens
- API requests include auth token in headers
- User permissions checked via `userPermissions` utility
- Private routes wrapped in Auth Provider

### Offline Capabilities

- IndexedDB stores unpublished changes
- Photos and attachments cached locally
- Sync occurs when connection restored
- Unpublished updates tracked per entity

### Real-time Updates

- ReactFire provides automatic Firestore synchronization
- Components re-render on data changes
- No Redux - state managed through Firebase subscriptions

### File Upload Pattern

- Files uploaded to Firebase Storage
- Progress tracking via upload handlers
- Attachments linked to entities via Firestore
- Local photo caching for offline viewing

### Testing Approach

- Jest with React Testing Library
- Unit tests for hooks and utilities (*.spec.ts)
- Integration tests in __tests__ directories
- Mock Firebase and IndexedDB in tests
- Use data-testid attributes for element selection

### Key Technologies

- **Next.js 12** - React framework with SSR/SSG
- **TypeScript** - Type safety throughout
- **Firebase 8.6** - Auth, Firestore, Storage
- **ReactFire** - Firebase React bindings
- **Dexie** - IndexedDB wrapper for offline
- **SCSS Modules** - Component-scoped styling
- **React Hook Form + Yup** - Form handling and validation

### Important Patterns

1. **Error Handling**: Custom error classes (BadRequest, NotFound, etc.) thrown from services
2. **Loading States**: All hooks return `status: 'loading' | 'success' | 'error'`
3. **Memoization**: `memo` property tracks data changes for performance
4. **File Naming**: Components in PascalCase directories with index.tsx entry
5. **Styling**: CSS modules with styles.module.scss per component
6. **API Responses**: Normalized using `normalizeJsonApiDoc` utility

### Environment Variables

Uses Next.js environment variable system. Key variables include:
- Firebase configuration
- API base URLs
- Feature flags

### Deployment

- Docker support with Alpine Node image
- Firebase Hosting configuration
- Static export capability via `yarn export`
- Git tag versioning for releases