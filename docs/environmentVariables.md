# Environment Variables

Sparkle clients need to be configured with variables that are either sensitive (for security reasons) or provide data about it's environment.

[Next.js](https://nextjs.org/docs/basic-features/environment-variables) has built-in support for loading environment variables from `.env.local` and accessible during build time from `process.env.*`. By default, there is no `.env.local` file because it's ignored by git. **So you must create this file manually.**

**Here's an example .env.local file:**

```
NEXT_PUBLIC_FIREBASE_API_KEY=123abc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<domain>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://<domain>.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<domain>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=836016449375
NEXT_PUBLIC_FIREBASE_APP_ID=1:836016449375:web:0599637a82b4717c79f8ea
NEXT_PUBLIC_FIREBASE_FUNCTIONS_DOMAIN=https://<api-domain>.cloudfunctions.net
NEXT_PUBLIC_STAGING=true
```

You'll need to provide your own variables by downloading the project configuration from the [Firebase Console](https://console.firebase.google.com/).

## References

[Next.js supports environment variables out of the box](https://nextjs.org/docs/basic-features/environment-variables)
