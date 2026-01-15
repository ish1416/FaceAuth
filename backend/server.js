const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData, loadImage } = require('canvas');
const cors = require('cors');

// Monkey patch face-api.js with canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();
const PORT = 3000;

// Global variable to store enrolled face descriptor
let enrolledDescriptor = null;

// Enable CORS for all routes
app.use(cors());

// Load face-api.js models
async function loadModels() {
  const modelPath = path.join(__dirname, 'models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  console.log('Models loaded');
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  
  res.json({
    filename: req.file.filename,
    path: req.file.path
  });
});

app.post('/enroll', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const img = await loadImage(req.file.path);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (!detection) {
      return res.status(400).json({ error: 'No face detected' });
    }

    enrolledDescriptor = detection.descriptor;
    res.json({ enrolled: true });
  } catch (error) {
    res.status(500).json({ error: 'Face processing failed' });
  }
});

app.post('/verify', upload.single('image'), async (req, res) => {
  if (!enrolledDescriptor) {
    return res.status(400).json({ error: 'No enrolled face found' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const img = await loadImage(req.file.path);
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (!detection) {
      return res.status(400).json({ error: 'No face detected' });
    }

    const distance = faceapi.euclideanDistance(enrolledDescriptor, detection.descriptor);
    const success = distance <= 0.6;

    res.json({ success, distance });
  } catch (error) {
    res.status(500).json({ error: 'Face processing failed' });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await loadModels();
});
