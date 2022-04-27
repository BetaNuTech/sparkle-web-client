# Continuous Deployments

The CD pipeline is initiated by pushing to the remote branches:

- `production`
- `staging`

The CD is managed by Github Action: `.github/workflows/deploy.yml`. However before you deploy to either remote brach be sure the following variables are setup in the Github repo's secrets.

### Firabase Token

To publish to anywhere, first add a `FIREBASE_TOKEN` to your github secrets. This should be a token from an account with access to both the staging and production firebase hosting destinations.

To create a firebase token follow these steps in your terminal:

1. Run `npm install -g firebase-tools`
2. Run `firebase login:ci`
3. Copy the resulting token in your console as the `FIREBASE_TOKEN` in your Github Secrets

### Production Deploys

The following variables are required to successfully publish to production:

```shell
PRODUCTION_FIREBASE_API_KEY=... # Project settings
PRODUCTION_FIREBASE_APP_ID=... # Project settings
PRODUCTION_FIREBASE_AUTH_DOMAIN=... # Project settings
PRODUCTION_FIREBASE_DATABASE_URL=... # Project settings
PRODUCTION_FIREBASE_MESSAGING_SENDER_ID=... # Project settings
PRODUCTION_FIREBASE_PROJECT_ID=... # Project settings
PRODUCTION_FIREBASE_STORAGE_BUCKET=... # Project settings
PRODUCTION_FIREBASE_MEASUREMENT_ID=... # Project settings
PRODUCTION_SLACK_CLIENT_ID=... # Slack App settings
PRODUCTION_TRELLO_API_KEY=... # Trello User settings
PRODUCTION_FIREBASE_FUNCTIONS_DOMAIN=... # Project's functions domain
PRODUCTION_GOOGLE_ANALYTICS=... # Google Analytics
```

### Staging Deploys

The following variables are required to successfully publish to staging:

```shell
STAGING_FIREBASE_API_KEY=... # Project settings
STAGING_FIREBASE_APP_ID=... # Project settings
STAGING_FIREBASE_AUTH_DOMAIN=... # Project settings
STAGING_FIREBASE_DATABASE_URL=... # Project settings
STAGING_FIREBASE_MESSAGING_SENDER_ID=... # Project settings
STAGING_FIREBASE_PROJECT_ID=... # Project settings
STAGING_FIREBASE_STORAGE_BUCKET=... # Project settings
STAGING_FIREBASE_MEASUREMENT_ID=... # Project settings
STAGING_SLACK_CLIENT_ID=... # Slack App settings
STAGING_TRELLO_API_KEY=... # Trello User settings
STAGING_FIREBASE_FUNCTIONS_DOMAIN=... # Project's functions domain
```
