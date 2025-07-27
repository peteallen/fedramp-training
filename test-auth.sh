#!/bin/bash

# Test script for basic authentication

echo "Testing Basic Authentication Setup"
echo "=================================="
echo ""

# Set test credentials
export BASIC_AUTH_USER=testuser
export BASIC_AUTH_PASSWORD=testpass

echo "Test credentials set:"
echo "Username: testuser"
echo "Password: testpass"
echo ""

# Build the app
echo "Building the application..."
pnpm build

if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi

echo ""
echo "Starting server with authentication..."
echo "Visit http://localhost:4173 and use the test credentials"
echo "Press Ctrl+C to stop"
echo ""

# Start the server
node server.cjs