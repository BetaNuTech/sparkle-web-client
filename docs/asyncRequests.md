## Standards
- Async requests with a single aysnc step should be simple Promises not async functions:
```js
// Wrong ⛔️
const badReq = async () => {
  try {
    const value = await create();
  } catch (err) {}
}

// Correct ✅
const goodReq => create()
  .then(() => ...)
  .catch(() => ...)
```
- Always handle error cases in async requests:
```js
// Cowboy Code 🤠⛔️
const badReq = async () => {
  const optimistic = await create();
};

// Correct ✅
const goodReq = async () => {
  let value = null;
  try {
    value = await create();
  } catch (err) {
    // handle here
  }
};
```
- Interacting with backing services (API/Firestore) should only be handled in services

## Error Wrapping
Error wrapping allows us to include information about an error at every point in our code base.  This makes debugging error logs massively easier.
- To wrap errors you'll need a constant `PREFIX` or a descripter of the file.  For a service it would look like: `common: services: api: inspections`.
- Next you need a error, often the result of a `try { } catch {}` block.
- Lastly you'll need a helpful message, here's all of it together:
```js
const PREFIX = 'common: services: blah:';
try {
  await create();
} catch (err) {
  throw Error(`${PREFIX} create request failed: ${err});
}
```
- This wrapped error  will "bubble up" to the next context where it can be wrapped again.
- Finally it can be logged in the parent context:
```js
const PREFIX = 'features: properties: controller:';
const createThing = () => {
  service.create()
    .catch(err => {
      const wrappedError = Error(`${PREFIX} well this blew up: ${err}`);
      console.error(wrappedError); // eslint-disable-line
      errorReports.send(wrappedError); // sent to API (fails siliently, so no need to catch errors)
      // Give user a helpful error message here
    });
};
```

## Error Reports
When something goes wrong in production we want to know about it.  These reports are our key to finding bugs early and often, without users having to tell us something went wrong.  Send an error reports:
```js
import errorReports from '../common/services/api/errorReports';

// after error:
errorReports.send(wrappedErr);
```
You can test that your error was sent using Sinon:
```js
const expected = true;
const sendError = sinon.stub(errorReports, 'send').callsFake(() => true);

const actual = sendError.called;
expect(actual).toEqual(expected);
```
