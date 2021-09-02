### Lazy Loading Components
Only loading components that are visible to the user can have a beneficial impact on performance.  To implement this:

1. Importing
```typescript
import useVisibility from '../common/hooks/useVisibility';
```

2. Component Setup
```typescript
interface Props {
  forceVisible?: boolean;
}

const MyComponent: FunctionComponent<Props> = ({ forceVisible }) => {
  const { isVisible } = useVisibility(ref, {}, forceVisible);
  // see step 3.
}

MyComponent.defaultProps = {
  forceVisible: false
};
```
NOTE: we use `forceVisible` to ensure the component is always visible in our test environment.

2. Component Usage
```typescript
return (
  <div class="placeholder">
    {isVisible ? (<h1>visible</h1>)}
  </div>
);
```
NOTE: the `.placeholder` element is always visible and has a `min-height` set to prevent "scroll jank" when the element becomes visible.

3. Testing
Since our hook uses the IntersectionObserver API we need to stup in for our tests.
```typescript
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';

beforeEach(() => stubIntersectionObserver());
```
NOTE: don't forget to render your component with `forceVisible={true}` so that your test render the component as expected.
