const express = require('express');
const path = require('path');
const fs = require('fs');
const basicAuth = require('express-basic-auth');

console.log('Starting server...');
console.log('Current directory:', __dirname);
console.log('PORT:', process.env.PORT || 4173);

const app = express();
const PORT = process.env.PORT || 4173;

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('ERROR: dist directory not found at', distPath);
  console.error('Build may have failed or files are in wrong location');
  process.exit(1);
}

console.log('Serving static files from:', distPath);

// Health check endpoint (must be before auth middleware)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

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

  // Apply auth middleware to all routes except /health
  app.use((req, res, next) => {
    if (req.path === '/health') {
      return next();
    }
    authMiddleware(req, res, next);
  });
} else {
  console.log('Basic authentication disabled (no credentials configured)');
}

// Serve static files from the dist directory
app.use(express.static(distPath));

// Handle all other routes by serving index.html
app.use((req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('ERROR: index.html not found at', indexPath);
    res.status(404).send('index.html not found');
    return;
  }
  res.sendFile(indexPath);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log('Server started successfully');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});