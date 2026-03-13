#!/usr/bin/env bash
# exit on error
set -o errexit

echo "--- Starting Render Build Process ---"

# Step 1: Install root dependencies
echo "Installing root dependencies..."
npm install

# Step 2: Build the frontend (Vite)
echo "Building frontend..."
npm run build

# Step 3: Clean up root node_modules if needed (Optional, but saves space)
# rm -rf node_modules

# Step 4: Install server dependencies
echo "Installing server dependencies..."
cd server
npm install

echo "--- Build Process Completed Successfully ---"
exit 0
