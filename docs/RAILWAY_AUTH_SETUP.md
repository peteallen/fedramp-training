# Railway Basic Authentication Setup Guide

This guide explains how to set up basic authentication for the FedRAMP Training app when deployed to Railway.

## Overview

The application now includes basic authentication middleware that protects the entire app before any files are served. This authentication is:
- Optional (only activates when credentials are configured)
- Configurable via Railway environment variables
- Compatible with Railway's deployment environment
- Simple to implement and manage

## Implementation Details

### Server Configuration

The authentication is implemented in `server.cjs` using the `express-basic-auth` package:

```javascript
// Configure basic authentication
// Only apply auth if credentials are provided via environment variables
if (process.env.BASIC_AUTH_USER && process.env.BASIC_AUTH_PASSWORD) {
  console.log('Basic authentication enabled');
  
  const authMiddleware = basicAuth({
    users: {
      [process.env.BASIC_AUTH_USER]: process.env.BASIC_AUTH_PASSWORD
    },
    challenge: true, // Shows browser popup for credentials
    realm: 'FedRAMP Training Portal',
    unauthorizedResponse: (req) => {
      return 'Authentication required to access the FedRAMP Training Portal';
    }
  });

  // Apply auth middleware before serving any files
  app.use(authMiddleware);
} else {
  console.log('Basic authentication disabled (no credentials configured)');
}
```

### Key Features

1. **Middleware Order**: The auth middleware is placed BEFORE the static file middleware, ensuring all requests are authenticated first
2. **Challenge Mode**: When enabled, the browser shows a native authentication popup
3. **Custom Realm**: The authentication realm is set to "FedRAMP Training Portal"
4. **Custom Error Message**: Users see a clear message when authentication fails
5. **Optional**: If no credentials are configured, the app runs without authentication

## Setting Up on Railway

### Step 1: Navigate to Your Service

1. Log into Railway
2. Go to your project
3. Click on your service (e.g., "fedramp-training")
4. Navigate to the "Variables" tab

### Step 2: Add Environment Variables

Add the following variables:

1. **BASIC_AUTH_USER**: The username for authentication
   - Example: `admin`
   
2. **BASIC_AUTH_PASSWORD**: The password for authentication
   - Example: `secretpassword123`
   - **Important**: Consider sealing this variable for extra security

### Step 3: Seal Sensitive Variables (Recommended)

To seal the password variable for extra security:

1. Click the 3-dot menu on the right side of the `BASIC_AUTH_PASSWORD` variable
2. Choose the "Seal" option
3. Confirm the action

**Note**: Sealed variables cannot be un-sealed. The value will be provided to your app but won't be visible in Railway's UI or retrievable via API.

### Step 4: Deploy Changes

After adding or updating variables:

1. Review the staged changes
2. Click "Deploy" to apply the changes
3. Railway will automatically redeploy your service with the new configuration

## Testing the Authentication

### Local Testing

To test locally, run:

```bash
# Set environment variables
export BASIC_AUTH_USER=testuser
export BASIC_AUTH_PASSWORD=testpass

# Build and run
pnpm build
node server.cjs
```

Then visit `http://localhost:4173` - you should see an authentication popup.

### Production Testing

After deploying to Railway:

1. Visit your Railway app URL
2. You should see a browser authentication popup
3. Enter the credentials you configured
4. Once authenticated, you can access the training portal

### Browser Behavior

- Most modern browsers will cache the credentials for the session
- Users will need to re-authenticate if they close and reopen the browser
- To force re-authentication, users can clear their browser's saved passwords

## Security Considerations

### What This Provides

- Basic protection against unauthorized access
- Credentials transmitted with Base64 encoding (over HTTPS on Railway)
- Simple implementation suitable for internal tools
- No session management overhead

### What This Doesn't Provide

- High-security authentication (use OAuth/JWT for that)
- User management or role-based access
- Password reset functionality
- Audit logging

### Best Practices

1. **Use HTTPS**: Railway automatically provides HTTPS, which encrypts credentials in transit
2. **Strong Passwords**: Use strong, unique passwords for production
3. **Seal Variables**: Always seal sensitive variables in Railway
4. **Regular Updates**: Periodically update passwords
5. **Limited Access**: Only share credentials with authorized users

## Multiple Users (Advanced)

To support multiple users, modify the environment variable format:

```javascript
// In server.cjs, you could parse a comma-separated list:
// BASIC_AUTH_USERS=user1:pass1,user2:pass2,user3:pass3

if (process.env.BASIC_AUTH_USERS) {
  const users = {};
  process.env.BASIC_AUTH_USERS.split(',').forEach(pair => {
    const [user, pass] = pair.split(':');
    users[user] = pass;
  });
  
  const authMiddleware = basicAuth({
    users: users,
    // ... rest of config
  });
}
```

## Troubleshooting

### Authentication Not Working

1. Check Railway logs for "Basic authentication enabled" message
2. Verify environment variables are set correctly
3. Ensure you've deployed after adding variables
4. Check for typos in username/password

### Can't Access After Authentication

1. Clear browser cache and cookies
2. Try a different browser
3. Check Railway logs for errors
4. Verify the build succeeded

### Health Check Endpoint

The `/health` endpoint bypasses authentication for Railway's health checks. If you need to protect this too, move it after the auth middleware.

## Removing Authentication

To disable authentication:

1. Remove the `BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` variables from Railway
2. Deploy the changes
3. The app will run without authentication

Or, keep the code but don't set the environment variables - the auth will be skipped automatically.