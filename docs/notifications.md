## User (In App) Notifications
Provide our users with temporary feedback on the result on an action.  To send a user a notification: import, configure, and then send.

```tsx
// Import (in controller)
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line

// Configure
/* eslint-disable */
const sendNotification = notifications.createPublisher(useNotifications());
/* eslint-enable */

// Send
sendNotification('Failed to delete', { appearance: 'error' });
```

_Importing and configuring should be done in the controller._

**Testing User Notifications**
```tsx
const expected = true;
const sendNotification = sinon.spy();

renderHook(() => myHook(sendNotification));

const actual = sendNotification.called;
expect(actual).toEqual(expected);
```


## Global Notifications
Special notifications in Sparkle that are sent to other users of the organization.  These are written directly to Firestore and are managed by the backend to send Slack and push notifications.

```ts
// Import
import globalNotification from '../../../common/services/firestore/notifications';

// Send
globalNotification.send(firestore, {
  creator: user.id,
  title: 'Property Deletion',
  // eslint-disable-next-line import/no-named-as-default-member
  summary: globalNotification.compileTemplate('property-delete-summary', {
    name,
    authorName
  }),
  // eslint-disable-next-line import/no-named-as-default-member
  markdownBody: globalNotification.compileTemplate(
    'property-delete-markdown-body',
    {
      name,
      authorName,
      authorEmail
    }
  )
});
```

Note how Global Notifications have templates that must be compiled with the appropriate state.

**Testing Global Notifications**
```tsx
// Import
import globalNotification from '../../../common/services/firestore/notifications';

// test
const expected = true;
const globalNotificaion = sinon
  .stub(globalNotification, 'send')
  .callsFake(() => true);
  
renderHook(() => myHook());
  
const actual = globalNotificaion.called;
expect(actual).toEqual(expected);
```
