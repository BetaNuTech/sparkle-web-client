# Patterns & Practices

- [Controllers](#controllers)
- [Views](#views)
- [Model Hooks](#model-hooks)
- [Store](#store)
- [Action Hooks](#action-hooks)
- [Services](#services)
- [Higher Order Components](#higher-order-components)

## Controllers

All the top level components under: `/features` (ie `/features/Properties/index.tsx`). [Controllers have a lot of responsibilities](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller#Components), so we work hard to keep them as small as possible by moving complex code elsewhere. Controllers are responsible for setting up hooks, providing actions to children, and managing super basic state.

**Bottom line:** Controllers are convenient, but don't abuse them. Keep them small and tidy with hooks and child components 🧼.

## Views

Mostly managed by the presentational components, usually children of the controller components. They are responsible for handling the data down actions up work. Rendering the data from the modal correctly and sending user feedback up to actions.

**Helpful Tip:** If presentational logic is getting complex or repetitive move it to a utility function.
**Utility Functions:** Small functions that manage complex presentational logic, found in `/utils` directories

## Model Hooks

Are responsible for loading data from the store and notifying the React system of updates. (ie [useProperties](/blob/develop/features/Properties/hooks/useProperties.ts) hook). Firebase and [ReactFire](https://github.com/FirebaseExtended/reactfire) will notify us of updates, we need to notify the system when to update the DOM.

Data flows to users like so:
`Firebase SDK => Services => Model Hook`

## Store

The Firebase SDK manages the store (Firestore) for us. We only interact with Firebase/Firestore from services (ie `/common/services/firestore/properties.ts`).

## Action Hooks

Are responsible for responding to user input, either updating local state, or updating the store. (ie [useDeleteProperty](/blob/develop/common/hooks/useDeleteProperty.ts))

Data flows from users like so:

- `Actions => Hooks => Services => Firebase SDK`
- `Actions => Hooks => Services => Backend API`

## Services

Integrate with backing services (ie Firestore & Backend API). You can learn more about services by [learning about 12 Factor Apps](https://12factor.net/backing-services)

### Higher Order Components

A tremendously powerful pattern. Abstracts repetitive logic into a function that returns a new React Component. Functional Components have made this design pattern even easier, which is what we use for [our prompts and modals](/blob/develop/common/Modal/index.tsx).
