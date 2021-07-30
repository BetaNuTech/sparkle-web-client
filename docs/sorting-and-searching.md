## Sorting

Sorting allows us to reorganize information according to user preferences, not remove it. Sorting needs to be implemented on a case by case basis.

## Searching

Searching acts as a filter that removes information that does not match a user's query.

###### 1. Importing

```ts
import useSearching from '../../common/hooks/useSearching';
```

###### 2. Setup

```ts
const { onSearchKeyDown, filteredItems, searchParam } = useSearching(
  templates,
  ['name', 'description']
);
```

Where `templates` in this case is an array of template records. The second argument is an array of all the attributes we'd like to be able to search by. In this case we're allowing users to search each template's `name` and `description`.

###### 3. Add More Filters (Optional)

Use the `filteredItems` returned by our search hook as the input for a second round of filtering.

###### 4. Add Search Events & Bindings

```tsx
<input
  placeholder="Search Jobs"
  type="search"
  defaultValue={searchParam}
  onKeyDown={onSearchKeyDown}
/>
```
