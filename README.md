This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Installation

Ensure you have yarn installed and run:

```bash
yarn
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


## Production Dependencies

### Core Framework and UI

1. **next (^12.1.0)**
   - A React framework for server-rendered applications
   - Used as the foundation of your application, providing routing, server-side rendering, and build optimization
   - Evident from your `next.config.js` and the project structure with `/pages` directory

2. **react (17.0.2) & react-dom (17.0.2)**
   - Core libraries for building user interfaces
   - Used throughout your application for creating components and rendering them to the DOM

3. **sass (^1.32.13)**
   - CSS preprocessor that allows for more maintainable styling
   - Used for styling your components with the `.scss` extension

### Firebase and Backend Integration

4. **firebase (^8.6.0)**
   - Backend-as-a-Service platform for authentication, database, storage, and more
   - Used extensively in your project for:
     - Authentication (`firebase/auth`)
     - Cloud Storage for file uploads (`firebase/storage`)
     - Firestore database for data management
   - Initialized in `common/utils/initFirebase.ts`

5. **reactfire (^3.0.0-rc.0)**
   - React bindings for Firebase
   - Used for hooks like `useFirestoreCollectionData` and `useFirestoreDocData` to interact with Firestore
   - Seen in multiple service files like `common/services/firestore/templates.ts`

### Form Handling and Validation

6. **react-hook-form (^7.5.3)**
   - Library for form state management and validation
   - Used for handling forms throughout your application

7. **@hookform/resolvers (^2.4.0)**
   - Validation resolvers for react-hook-form
   - Allows integration with validation libraries

8. **yup (^0.32.9)**
   - Schema validation library
   - Used with react-hook-form for form validation

9. **react-signature-canvas (^1.0.3)**
   - Component for capturing signatures
   - Likely used in forms that require signature input

10. **react-dropzone (^11.4.2)**
    - Library for file uploads with drag and drop functionality
    - Used for file upload interfaces, particularly with Firebase Storage as seen in `docs/fileUploads.md`

### UI Components and Styling

11. **clsx (^1.1.1)**
    - Utility for constructing className strings conditionally
    - Used for dynamic styling of components

12. **react-toastify (^7.0.4)**
    - Toast notification library
    - Used for displaying notifications to users

13. **swiper (6.8.4)**
    - Touch slider library
    - Used for creating carousels and sliders in your UI

14. **react-responsive (^8.2.0)**
    - Media query hooks for responsive design
    - Used for creating responsive layouts

### Data Management and Utilities

15. **immer (^9.0.2)**
    - Library for working with immutable state
    - Allows for simpler state updates in a more mutable style

16. **moment (^2.29.1)**
    - Date manipulation library
    - Used for handling dates and times

17. **dexie (^3.2.0)**
    - IndexedDB wrapper
    - Used for client-side storage, likely for offline capabilities

18. **deep-object-diff (^1.1.0)**
    - Utility for finding differences between objects
    - Useful for state comparison and optimization

19. **async (^3.2.3)**
    - Utility library for asynchronous JavaScript
    - Provides functions for working with asynchronous code

20. **handlebars (^4.7.7)**
    - Templating engine
    - Used for generating dynamic content from templates

21. **zen-observable (^0.8.15)**
    - Implementation of the Observable pattern
    - Used for handling asynchronous data streams

### Drag and Drop

22. **@dnd-kit/core (^5.0.3), @dnd-kit/modifiers (^5.0.0), @dnd-kit/sortable (^6.0.1)**
    - Libraries for drag and drop functionality
    - Used for creating sortable interfaces and drag-and-drop interactions

### Data Visualization

23. **chart.js (^3.4.1) & react-chartjs-2 (^3.0.3)**
    - Libraries for creating charts and data visualizations
    - Used for displaying data in visual formats

### Miscellaneous

24. **platform (^1.3.6)**
    - Browser detection library
    - Used for detecting browser/platform information

25. **git-tag-version (^1.3.1)**
    - Utility for working with git tags
    - Likely used in your build/deployment process

## Development Dependencies

1. **TypeScript and Type Definitions**
   - `typescript`, `@types/node`, `@types/react`, `@types/jest`, `@types/gtag.js`
   - Used for static type checking and improved developer experience

2. **Testing Libraries**
   - `jest`, `@testing-library/*`, `ts-jest`, `babel-jest`, etc.
   - Used for unit and integration testing of your components and logic

3. **Linting and Formatting**
   - `eslint`, `prettier`, and related plugins
   - Used for code quality and consistent formatting

4. **Babel**
   - `@babel/preset-typescript`, `babel-plugin-inline-react-svg`, etc.
   - Used for transpiling modern JavaScript and TypeScript to browser-compatible code

5. **Mock Libraries**
   - `fake-indexeddb`, `jest-canvas-mock`, `sinon`
   - Used for mocking dependencies during testing


## Architecture Insights

Your project follows a feature-based architecture where:

1. **Pages** define the routing and basic page structure
2. **Features** contain the business logic and UI for specific functionality
3. **Common** provides shared utilities, services, and components
4. **Config** centralizes configuration
5. **Styles** manages global styling


## Feature Structure

/pages/
This directory is fundamental to Next.js applications as it defines the routing structure:
- `_app.tsx` - Custom App component that wraps all pages, likely handling global state and layout
- `_document.tsx` - Custom Document component for modifying the initial HTML and body tags
- `index.jsx` - The homepage of your application
- `404.tsx` - Custom 404 error page
- `/login/` - Authentication-related pages
- `/properties/` - Pages related to property management
- `/users/` - User management pages
- `/templates/` - Template management pages
- `/teams/` - Team management pages
- `/settings/` - Application settings pages
- `/ios/` - Possibly iOS-specific functionality or views


### Configuration Files
- `package.json` - NPM package configuration and scripts
- `tsconfig.json` - TypeScript configuration
- `next.config.js` - Next.js configuration
- `jest.config.js` - Jest testing configuration
- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier code formatting configuration
- `.babelrc` - Babel configuration
- `firebase.json` - Firebase project configuration
- `docker-compose.yml` & `Dockerfile` - Docker configuration for containerization


/features/
  /Users/ - User management feature
  /UserEdit/ - User editing functionality
  /Templates/ - Template management
  /TemplateEdit/ - Template editing
  /Settings/ - Application settings
  /TeamProfile/ - Team profile management
  /PropertyWorkOrders/ - Work orders for properties
  /PropertyUpdateInspection/ - Property inspection updates
  /PropertyResidents/ - Resident management for properties
  /PropertyProfile/ - Property profile information
  /PropertyEdit/ - Property editing functionality
  /Properties/ - Property listing and management
  /Login/ - Authentication feature
  /JobList/ - Job listing functionality
  /JobEdit/ - Job editing
  /JobBids/ - Bidding system for jobs
  /DeficientItems/ - Deficiency tracking
  /DeficientItemEdit/ - Editing deficient items
  /CreateInspection/ - Creating new inspections
  /BidEdit/ - Bid editing functionality

## Common Directory Structure

/common/
  /hooks/ - Custom React hooks
  /models/ - Data models/interfaces
  /services/ - Service layer for API interactions
    /firestore/ - Firebase Firestore services
    /api/ - API client services
  /utils/ - Utility functions
  /components/ - Shared UI components

## Configuration Files

/config/
  /firebase.ts - Firebase configuration
  /collections.ts - Firestore collection names
  /routes.ts - Application routes

/styles/
  /globals.scss - Global styles
  /variables.scss - SCSS variables
  /mixins.scss - SCSS mixins

/public/
  /images/ - Image assets
  /icons/ - Icon assets
  /fonts/ - Font files

/__tests__/
  /unit/ - Unit tests
  /integration/ - Integration tests

/__mocks__/
  /firebase.js - Firebase mocks
  /next.js - Next.js mocks

/@types/
  /global.d.ts - Global type declarations
  /custom.d.ts - Custom type declarations

/docs/
  /fileUploads.md - Documentation for file upload functionality
  /authentication.md - Authentication documentation
  /deployment.md - Deployment instructions


