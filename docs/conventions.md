# Conventions

- [File Structure](#file-structure)
- [Code Styling](#code-styling)
- [Commenting](#commenting)
- [Creating Components](#creating-components)

## File Structure

Using the [recommended Redux architecture](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go):

```txt
index.jsx: Entry point file that renders the React component tree
/pages
    _app.jsx: root React component
    index.jsx: home route
/app
    store.js: store setup
    rootReducer.js: root reducer
/common: globally used hooks, generic components, utils, etc
/features: contains all "feature folders"
    /todos: a single feature folder
        todosSlice.js: Redux reducer logic and associated actions
        Todos.jsx: a React component
```

## Code Styling

- [Airbnb JS code style convention system](https://github.com/airbnb/javascript#table-of-contents).

## Commenting

- Use `// comments` before complicated logic. Facilitate easy skimming of your code and be considerate of the next developer that must work with your code.

## Creating Components

- Component property types should be enforced with Typescript `types` or `inferences`.
- Component default values should be set after the component logic.
