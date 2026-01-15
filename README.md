# FaceAuth

A Node.js backend application for face authentication with image upload capabilities.

## Features
- Express.js server
- Image upload with multer
- Health check endpoint

## Setup
```bash
cd backend
npm install
npm start
```

## Endpoints
- GET `/health` - Health check
- POST `/upload` - Upload image (field name: "image")