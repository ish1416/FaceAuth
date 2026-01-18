# Development Guide - Government of India Face Liveness Detection System

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator (or physical device)

### Setup
```bash
# Run the setup script
./setup.sh

# Or manual installation
npm install
npx expo install --fix

# Start development server
npx expo start
```

## 📱 Development Workflow

### 1. Screen Development
Each screen follows the Government design standards:

```typescript
// Screen template
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GovHeader } from '../components/GovHeader';
import { colors } from '../theme/colors';

export default function MyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <GovHeader title="Screen Title" showBack={true} />
      {/* Screen content */}
    </SafeAreaView>
  );
}
```

### 2. Component Development
Use Government components for consistency:

```typescript
import { GovButton } from '../components/GovButton';
import { GovCard } from '../components/GovCard';
import { GovStatusBadge } from '../components/GovStatusBadge';

// Usage
<GovButton onPress={handlePress} icon="check">
  Action Button
</GovButton>

<GovCard 
  title="Card Title"
  subtitle="Description"
  icon="information"
  onPress={handleCardPress}
/>

<GovStatusBadge status="success" text="Verified" />
```

### 3. Navigation
All navigation uses typed routes:

```typescript
import { NavigationProps } from '../types/navigation';

const navigation = useNavigation<NavigationProps>();

// Navigate with parameters
navigation.navigate('Success', { livenessScore: 96 });

// Navigate and reset stack
navigation.reset({
  index: 0,
  routes: [{ name: 'Welcome' }],
});
```

## 🎨 Design System

### Colors
```typescript
// Government standard colors
colors.primary      // #0B3C5D - Deep Navy Blue
colors.success      // #1B5E20 - Government Green
colors.accent       // #D4A017 - Muted Gold
colors.background   // #F5F5F5 - Light Gray
colors.surface      // #FFFFFF - White
colors.textPrimary  // #212121 - High Contrast
```

### Typography
```typescript
// Accessible typography
typography.h1       // 32px, weight 700 - Main titles
typography.h2       // 24px, weight 600 - Section headers
typography.body     // 16px, weight 400 - Body text (min size)
typography.button   // 16px, weight 600 - Button text
```

### Spacing
```typescript
spacing.xs   // 4px
spacing.sm   // 8px  
spacing.md   // 16px
spacing.lg   // 24px
spacing.xl   // 32px
spacing.xxl  // 48px
```

## 📷 Camera Integration

### Liveness Detection Steps
The camera screen implements 5 progressive steps:

```typescript
const stepOrder: LivenessStep[] = [
  'position',   // Center face in oval
  'blink',      // Blink twice naturally  
  'turnLeft',   // Turn head left
  'turnRight',  // Turn head right
  'smile'       // Show natural smile
];
```

### Camera Permissions
```typescript
import { useCameraPermissions } from 'expo-camera';

const [permission, requestPermission] = useCameraPermissions();

if (!permission?.granted) {
  // Show permission request UI
  return <PermissionScreen onRequest={requestPermission} />;
}
```

### Face Detection Integration
```typescript
// Future ML Kit integration
import { FaceDetector } from 'expo-face-detector';

const detectFace = async (imageUri: string) => {
  const faces = await FaceDetector.detectFacesAsync(imageUri, {
    mode: FaceDetector.Constants.Mode.accurate,
    detectLandmarks: FaceDetector.Constants.Landmarks.all,
    runClassifications: FaceDetector.Constants.Classifications.all,
  });
  
  return faces.length > 0;
};
```

## 🔒 Security Implementation

### Local Processing
```typescript
// All biometric processing happens locally
const processLiveness = async (imageData: string) => {
  // Local ML processing
  const livenessScore = await localMLProcessor.analyze(imageData);
  
  // No network transmission
  return {
    score: livenessScore,
    timestamp: Date.now(),
    processed: 'locally'
  };
};
```

### Anti-Spoofing Measures
```typescript
const antiSpoofingChecks = {
  photoDetection: true,     // Detect static images
  videoDetection: true,     // Detect video replay
  maskDetection: true,      // Detect 3D masks
  livenessSteps: 5,         // Multi-step verification
  timeoutSecurity: 30000    // 30 second timeout
};
```

## ♿ Accessibility Guidelines

### Touch Targets
```typescript
// Minimum 48dp touch targets
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 48,
    // Ensure adequate spacing
  }
});
```

### Screen Reader Support
```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Start Face Liveness Check"
  accessibilityRole="button"
  accessibilityHint="Begins the face verification process"
>
  <Text>Start Verification</Text>
</TouchableOpacity>
```

### High Contrast
```typescript
// Ensure 4.5:1 contrast ratio minimum
const contrastRatios = {
  'textPrimary/background': 8.59,    // Excellent
  'textSecondary/background': 4.54,  // Good
  'primary/surface': 7.21,           // Excellent
};
```

## 🧪 Testing Strategy

### Unit Tests
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native

# Run tests
npm test
```

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { GovButton } from '../components/GovButton';

test('GovButton calls onPress when pressed', () => {
  const mockPress = jest.fn();
  const { getByText } = render(
    <GovButton onPress={mockPress}>Test Button</GovButton>
  );
  
  fireEvent.press(getByText('Test Button'));
  expect(mockPress).toHaveBeenCalled();
});
```

### E2E Testing
```bash
# Install Detox for E2E testing
npm install --save-dev detox

# Run E2E tests
npx detox test
```

## 📊 Performance Optimization

### Image Optimization
```typescript
const cameraSettings = {
  quality: 0.8,           // Balance quality/size
  skipProcessing: false,  // Enable processing
  base64: false,         // Avoid base64 for large images
  exif: false           // Skip EXIF data
};
```

### Memory Management
```typescript
// Cleanup camera resources
useEffect(() => {
  return () => {
    if (cameraRef.current) {
      cameraRef.current = null;
    }
  };
}, []);
```

### Animation Performance
```typescript
import { useSharedValue, runOnJS } from 'react-native-reanimated';

// Use native driver for animations
const animatedValue = useSharedValue(0);
animatedValue.value = withTiming(1, { duration: 300 });
```

## 🔧 Debugging

### Debug Mode
```bash
# Enable debug logging
export DEBUG_FACE_AUTH=true
npx expo start
```

### Camera Debugging
```typescript
const debugCamera = {
  showFPS: __DEV__,
  logDetections: __DEV__,
  saveDebugImages: __DEV__
};
```

### Performance Monitoring
```typescript
import { InteractionManager } from 'react-native';

const measurePerformance = (operation: string) => {
  const start = Date.now();
  
  InteractionManager.runAfterInteractions(() => {
    const duration = Date.now() - start;
    console.log(`${operation} took ${duration}ms`);
  });
};
```

## 🚀 Build & Deployment

### Development Build
```bash
# Create development build
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Production Build
```bash
# Create production build
eas build --profile production --platform android
eas build --profile production --platform ios
```

### Environment Configuration
```typescript
// app.config.js
export default {
  expo: {
    name: "Government Face Liveness",
    slug: "gov-face-liveness",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0B3C5D"
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Allow access to camera for face verification"
        }
      ]
    ]
  }
};
```

## 📝 Code Standards

### TypeScript
- Use strict mode
- Define interfaces for all props
- Use proper typing for navigation
- Avoid `any` type

### React Native
- Use functional components with hooks
- Implement proper error boundaries
- Use SafeAreaView for all screens
- Handle platform differences

### Government Standards
- Follow accessibility guidelines
- Use approved color palette
- Implement proper security measures
- Maintain audit trails

## 🔄 Version Control

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-liveness-step
git commit -m "feat: add new liveness detection step"
git push origin feature/new-liveness-step

# Create pull request for review
```

### Commit Messages
```
feat: add new camera permission handling
fix: resolve liveness detection timeout issue  
docs: update API documentation
style: apply government color standards
test: add unit tests for GovButton component
```

## 📞 Support & Resources

- **Technical Documentation**: See README.md
- **Design Guidelines**: Government of India Design System
- **Security Standards**: MeitY Security Guidelines
- **Accessibility**: WCAG 2.1 AA Standards
- **React Native**: https://reactnative.dev/docs
- **Expo**: https://docs.expo.dev/