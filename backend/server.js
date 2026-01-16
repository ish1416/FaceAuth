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
const PORT = process.env.PORT || 3000;

// Global variable to store enrolled face descriptor
let enrolledDescriptor = null;

// Persist descriptor to file
const DESCRIPTOR_FILE = path.join(__dirname, 'enrolled_descriptor.json');

function saveDescriptor() {
  if (enrolledDescriptor) {
    fs.writeFileSync(DESCRIPTOR_FILE, JSON.stringify(Array.from(enrolledDescriptor)));
    console.log('Descriptor saved to file');
  }
}

function loadDescriptor() {
  try {
    if (fs.existsSync(DESCRIPTOR_FILE)) {
      const data = JSON.parse(fs.readFileSync(DESCRIPTOR_FILE, 'utf8'));
      enrolledDescriptor = new Float32Array(data);
      console.log('Descriptor loaded from file');
    }
  } catch (error) {
    console.error('Error loading descriptor:', error.message);
  }
}

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Load face-api.js models
async function loadModels() {
  const modelPath = path.join(__dirname, 'models');
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
  console.log('Models loaded');
  
  // Warm up the models with a dummy detection
  try {
    const dummyCanvas = new Canvas(100, 100);
    const ctx = dummyCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 100, 100);
    await faceapi.detectSingleFace(dummyCanvas).withFaceLandmarks().withFaceDescriptor();
    console.log('Models warmed up');
  } catch (error) {
    console.log('Warmup completed (no face expected)');
  }
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
  console.log('=== ENROLL ENDPOINT CALLED ===');
  console.log('File uploaded:', !!req.file);
  
  if (!req.file) {
    console.log('ERROR: No file uploaded');
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    console.log('Loading image:', req.file.path);
    const img = await loadImage(req.file.path);
    console.log('Image loaded successfully');
    
    console.log('Starting face detection...');
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (!detection) {
      console.log('ERROR: No face detected');
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'No face detected' });
    }
    console.log('Face detected successfully');

    enrolledDescriptor = detection.descriptor;
    console.log('Face enrolled successfully');
    
    // Save descriptor to file
    saveDescriptor();
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json({ enrolled: true });
  } catch (error) {
    console.error('ENROLLMENT ERROR:', error.message);
    console.error('Stack trace:', error.stack);
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Face processing failed', details: error.message });
  }
});

app.post('/verify', upload.single('image'), async (req, res) => {
  console.log('=== VERIFY ENDPOINT CALLED ===');
  console.log('enrolledDescriptor exists:', !!enrolledDescriptor);
  console.log('File uploaded:', !!req.file);
  
  try {
    if (!enrolledDescriptor) {
      console.log('ERROR: No enrolled descriptor found');
      return res.status(400).json({ error: 'No enrolled face found' });
    }

    if (!req.file) {
      console.log('ERROR: No file uploaded');
      return res.status(400).json({ error: 'No image uploaded' });
    }

    console.log('Loading image for verification:', req.file.path);
    const img = await loadImage(req.file.path);
    console.log('Image loaded successfully');
    
    console.log('Starting face detection...');
    const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
    
    if (!detection) {
      console.log('ERROR: No face detected in verification image');
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'No face detected' });
    }
    console.log('Face detected successfully');

    console.log('Computing euclidean distance...');
    const distance = faceapi.euclideanDistance(enrolledDescriptor, detection.descriptor);
    const success = distance <= 0.6;
    console.log('Distance computed:', distance, 'Success:', success);

    const result = { success, distance };
    console.log('Sending verification result:', result);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);
    
    res.json(result);
  } catch (error) {
    console.error('VERIFICATION ERROR:', error.message);
    console.error('Stack trace:', error.stack);
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Face processing failed', details: error.message });
  }
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server running on port ${PORT}`);
  await loadModels();
  loadDescriptor();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION:', error);
});
