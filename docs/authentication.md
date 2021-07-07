Our current authentication system is build using [React Contexts](https://reactjs.org/docs/context.html) and [ReactFire utils](https://github.com/FirebaseExtended/reactfire/blob/main/docs/use.md#access-the-current-user).  This implementation is due to issues with ReactFire's auth libraries, eventually we'll refactor once ReactFire v3 has stablized.

## Architecture
Contains 2 components and 1 important hook
- `/common/Auth/Provider` is responsible for creating the auth context.
- `/common/Auth/Provider/useSession` is the source of the session, only the provider should access this directly.
- `/common/Auth/PrivateRoute` is responsible for enforcing session access throughout the application.

## Updating User's Session
- Only update the session by loading the auth context:
`import { useAuth } from '../common/Auth/Provider';`
- Only interact with the user's session through this context, for example:
`const { signOut } = useAuth();`

## Reading User's Session
If you don't need to update a user's session, then you can simply use ReactFire:
```Javascript
import { useUser } from 'reactfire';
const { data: authUser } = useUser();
```
