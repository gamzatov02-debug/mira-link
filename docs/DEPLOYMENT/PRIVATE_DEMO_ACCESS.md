# Private demo access

The complete `/demo` route tree is protected by a server-side signed session. Credentials and the signing secret exist only in the deployment environment.

## Required Netlify environment variables

- `DEMO_AUTH_USERS` — one JSON object whose keys are lowercase usernames and whose values are PBKDF2 credential strings.
- `DEMO_AUTH_SESSION_SECRET` — a random secret of at least 32 characters. Rotating it signs out every active demo user.

The initial logical usernames are `artur`, `stanislav`, and `developer`. Generate each credential locally without placing its password in shell history:

```sh
read -s DEMO_PASSWORD
printf '%s' "$DEMO_PASSWORD" | node scripts/hash-demo-password.mjs artur
unset DEMO_PASSWORD
```

Repeat for each username, then combine the generated key/value pairs into one JSON object and store that object as `DEMO_AUTH_USERS` in Netlify. Never commit the resulting object.

Generate the session secret with a cryptographically secure generator, such as `openssl rand -base64 48`, and store only the result in Netlify.

## User management

- Add a user: generate its credential, add the key/value pair to `DEMO_AUTH_USERS`, and redeploy.
- Change a password: generate a new credential for that username, replace its value, and redeploy.
- Revoke a user: remove its key/value pair and redeploy. Existing sessions for that username then fail validation.
- Revoke every session: rotate `DEMO_AUTH_SESSION_SECRET` and redeploy.

Netlify environment variables belong under **Project configuration → Environment variables**. Apply them to Production (and Deploy Previews only if private previews are required), then trigger a new deploy.
