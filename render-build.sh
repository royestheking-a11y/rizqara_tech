#!/bin/bash
# exit on error
set -e

echo "--- Render Build Logic Starting ---"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Step 1: Install frontend dependencies
echo "Installing Root/Frontend dependencies..."
npm install --no-audit --no-fund

# Step 2: Build frontend
echo "Building Frontend (Vite)..."
npm run build

# Step 3: Remove heavy frontend node_modules to save RAM for server install
echo "Cleaning up Frontend node_modules..."
rm -rf node_modules

# Step 4: Install Server dependencies
echo "Installing Server dependencies..."
cd server
npm install --no-audit --no-fund

echo "--- Build Completed Successfully ---"
