## Preserving Scroll Position

Sometimes users need to go back and forth frequently between different pages in the app. Preserving their scroll position can be a productivity boost, while reducing overall frustration. To preserve a pages latest scroll position:

###### 1. Importing

Controller:

```ts
import { useRef } from 'react';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
```

###### 2. Setup

Controller:

```ts
// Only create a scroll element if the
// scrolled container is not the main
// layout element
const scrollElementRef = useRef();

usePreserveScrollPosition(
  `unique-key-${someUrlWildcardId}`,
  scrollElementRef,
  isMobile // only if mobile UI differs from desktop
);
```

In the above example the desktop UI uses the main layout element to scroll, however the mobile UI has a special scroll container. We need to pass that reference down to the mobile container element.

###### 3. Optional: Custom Scroll Element

If the only scrolled element on your page is the main layout element, then you can skip this step. However let's assume we have separate mobile container/component that needs its' scroll state preserved:

```ts
import { FunctionComponent, RefObject } from 'react';

interface Props {
  scrollElementRef: RefObject<HTMLDivElement>;
}

const MyContainerComponent: FunctionComponent<Props> = ({
  scrollElementRef
}) => <div ref={scrollElementRef}>Scrollable content...</div>;
```
