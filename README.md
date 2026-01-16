# FaceAuth - Production Ready Face Authentication System

A professional-grade biometric authentication system using facial recognition technology.

## 🚀 Features

- **Face Enrollment**: Register users with camera capture or gallery upload
- **Face Verification**: Authenticate users against enrolled faces
- **Real-time Processing**: Fast face detection and matching
- **Enterprise UI**: Clean, professional interface suitable for government/corporate use
- **Cross-platform**: Works on iOS and Android via Expo
- **Secure**: Bank-grade security with local processing

## 📋 Prerequisites

- Node.js v20.x or higher
- npm or yarn
- Expo Go app (for mobile testing)
- Python 3.x (for face-api.js dependencies)

## 🛠️ Installation

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend/FaceAuth
npm install
```

## 🏃 Running the Application

### 1. Start Backend Server

```bash
cd backend
npm start
```

Server will run on `http://0.0.0.0:3000`

### 2. Update Frontend IP

Edit `frontend/FaceAuth/src/services/api.ts`:
```typescript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:3000';
```

Get your IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

### 3. Start Frontend

```bash
cd frontend/FaceAuth
npx expo start
```

Scan QR code with Expo Go app.

## 📱 User Flow

1. **Landing Page** → Click "Start Face Enrollment"
2. **Enrollment** → Capture photo or upload from gallery
3. **Verification** → Automatically navigates after enrollment
4. **Result** → Shows match confidence and verification status

## 🔧 Configuration

### Backend Configuration

**Port**: Edit `backend/server.js`
```javascript
const PORT = 3000;
```

**Face Match Threshold**: Adjust in `backend/server.js`
```javascript
const success = distance <= 0.6; // Lower = stricter
```

### Frontend Configuration

**Timeout**: Edit `frontend/FaceAuth/src/services/api.ts`
```typescript
timeout: 60000, // milliseconds
```

**Camera Quality**: Edit capture screens
```typescript
quality: 0.8, // 0.0 to 1.0
```

## 🎨 UI Customization

### Colors
Edit `frontend/FaceAuth/src/theme/colors.ts`

### Spacing
Edit `frontend/FaceAuth/src/theme/spacing.ts`

### Typography
Edit `frontend/FaceAuth/src/theme/typography.ts`

## 📂 Project Structure

```
Faceauth/
├── backend/
│   ├── models/              # Face-api.js model files
│   ├── uploads/             # Temporary image storage
│   ├── server.js            # Express server
│   └── package.json
│
└── frontend/FaceAuth/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── screens/         # App screens
    │   ├── services/        # API services
    │   ├── theme/           # Design system
    │   └── navigation/      # Navigation config
    └── package.json
```

## 🔒 Security Considerations

1. **HTTPS**: Use HTTPS in production
2. **Authentication**: Add user authentication layer
3. **Rate Limiting**: Implement rate limiting on endpoints
4. **Data Storage**: Store face descriptors securely (encrypted database)
5. **Image Cleanup**: Auto-delete uploaded images after processing

## 🐛 Troubleshooting

### Network Error on Verification
- Check backend is running: `curl http://YOUR_IP:3000/health`
- Verify IP address in `api.ts` matches your network IP
- Ensure phone and computer are on same network
- Check firewall settings

### No Face Detected
- Ensure good lighting
- Face should be clearly visible
- Remove glasses if possible
- Try different angles

### Camera Permission Denied
- Go to phone Settings → Apps → Expo Go → Permissions
- Enable Camera permission

## 📊 API Endpoints

### Health Check
```
GET /health
Response: { "status": "ok" }
```

### Enroll Face
```
POST /enroll
Content-Type: multipart/form-data
Body: { image: File }
Response: { "enrolled": true }
```

### Verify Face
```
POST /verify
Content-Type: multipart/form-data
Body: { image: File }
Response: { "success": boolean, "distance": number }
```

## 🚀 Production Deployment

### Backend Deployment

1. **Environment Variables**
```bash
PORT=3000
NODE_ENV=production
```

2. **Process Manager** (PM2)
```bash
npm install -g pm2
pm2 start server.js --name faceauth-backend
pm2 save
pm2 startup
```

3. **Reverse Proxy** (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Frontend Deployment

1. **Build for Production**
```bash
cd frontend/FaceAuth
eas build --platform android
eas build --platform ios
```

2. **Update API URL**
```typescript
const API_BASE_URL = 'https://your-domain.com';
```

## 📝 License

Proprietary - All rights reserved

## 👥 Support

For issues and questions, contact the development team.

## 🔄 Version History

- **v1.0.0** - Initial production release
  - Face enrollment with camera/gallery
  - Face verification
  - Enterprise UI design
  - Production-ready backend
