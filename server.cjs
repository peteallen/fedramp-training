const express = require('express');
const path = require('path');
const fs = require('fs');

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

// Serve static files from the dist directory
app.use(express.static(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

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