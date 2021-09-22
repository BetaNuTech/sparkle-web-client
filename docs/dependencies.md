# Dependencies

All 3rd party code used by this application.

## Main

- [React](https://reactjs.org/) JavaScript library for building user interfaces.
- [React-dom](https://www.npmjs.com/package/react-dom) serves as the entry point to the DOM and server renderers for React.
- [Typescript](https://www.typescriptlang.org/) Typed Javascript

## Tooling

- [Next.js React Framework](https://nextjs.org/) manages the development environment, build, and more.

## Styling

- [SASS](https://sass-lang.com/) CSS extension language.
- [CLSX](https://www.npmjs.com/package/clsx) utility for constructing className strings conditionally.

## Store & Data

- [Firebase SDK](https://github.com/firebase/firebase-js-sdk) this acts as our application store.  [We do not use Redux with firebase](https://prescottprue.medium.com/react-and-firebase-without-redux-5c1b2b6a6ba1).  [Learn more](https://firebase.google.com/)
- [React Fire](https://github.com/FirebaseExtended/reactfire) firestore update watchers and miscellaneous firebase utilities.

## Linting

- [ESLint](https://eslint.org/) code styling according to Airbnb conventions, configured with the `estlinrc.json`
- [Prettier](https://prettier.io/) enforces styling, configured with `.prettierrc`
- ⚠️ Ensure that your IDE as a working integration with Prettier and ensure that **it's configured to formatted on save**!

## Forms & Validation

- [React Hook Form](https://react-hook-form.com/) is a library that helps you validate forms in React.

## Testing

- [Jest](https://facebook.github.io/jest/) test runner and utilities.
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) test utilities.
- [Sinon: Test Spys and Stubs](https://sinonjs.org/) for testing and mocking functions.

## Images & SVG's

- [Babel-plugin-inline-react-svg](https://github.com/airbnb/babel-plugin-inline-react-svg) for inline SVG support. Usage:
  `import Icon from '../public/icon.svg` then render: `<Icon />`. [Reference code](https://github.com/vercel/next.js/tree/master/examples/svg-components)

## Responsive Logic

- [React-Responsive](https://github.com/contra/react-responsive) helps avoid device specific content to improve performance. Use `/config/breakpoints.ts` for supported media query values.

## Browser Sniffing

- [Platform](https://github.com/bestiejs/platform.js) collects device information for use in notifications and error reports.

## Notifications

- [React Toastify](https://github.com/fkhadra/react-toastify) a nice service and UI for user notifications.

## Dates & Times

- [Moment.js](https://momentjs.com/) manages the formatting of dates into human readable formats

## Charts

- [react-chartjs-2](https://github.com/reactchartjs/react-chartjs-2) React Component based library wrapper of chart.js  
- [chart.js](https://www.chartjs.org/docs/latest/) library to show charts representation of data

## Misc

- [Git Tag Version](https://github.com/bushee/git-tag-version) calculates and returns project's current version based on git tags. Used to provide context to notifications, error reports, etc.
