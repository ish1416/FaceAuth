#!/bin/bash

echo "🏛️  Government of India Face Liveness Detection System"
echo "Setting up React Native application..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v20.x or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js v18.x or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Install additional required packages
echo ""
echo "📦 Installing additional React Native packages..."

# Navigation
npm install @react-navigation/native @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context

# Camera and Media
npm install expo-camera expo-image-picker

# Animations and Interactions  
npm install react-native-reanimated react-native-gesture-handler
npm install expo-haptics

# Graphics and Icons
npm install react-native-svg react-native-vector-icons

# Storage
npm install @react-native-async-storage/async-storage

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 To start the application:"
echo "   npx expo start"
echo ""
echo "🔧 For specific platforms:"
echo "   npx expo run:android"
echo "   npx expo run:ios"
echo ""
echo "📚 For help and documentation:"
echo "   See README.md or visit the Help screen in the app"
echo ""
echo "🏛️  Government of India - Ministry of Electronics & Information Technology"