import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing 
} from 'react-native-reanimated';
import Svg, { Ellipse } from 'react-native-svg';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { GovHeader } from '../components/GovHeader';
import { YellowSenseLogo } from '../components/YellowSenseLogo';
import { NavigationProps } from '../types/navigation';

const { width, height } = Dimensions.get('window');

type LivenessStep = 'position' | 'blink' | 'turnLeft' | 'turnRight' | 'smile';

interface StepConfig {
  title: string;
  instruction: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  duration: number;
}

const STEPS: Record<LivenessStep, StepConfig> = {
  position: {
    title: 'Position Your Face',
    instruction: 'Center your face in the oval',
    icon: 'face-recognition',
    duration: 3000
  },
  blink: {
    title: 'Blink Your Eyes',
    instruction: 'Blink twice naturally',
    icon: 'eye',
    duration: 4000
  },
  turnLeft: {
    title: 'Turn Left',
    instruction: 'Slowly turn your head left',
    icon: 'arrow-left',
    duration: 3000
  },
  turnRight: {
    title: 'Turn Right',
    instruction: 'Slowly turn your head right',
    icon: 'arrow-right',
    duration: 3000
  },
  smile: {
    title: 'Smile',
    instruction: 'Show a natural smile',
    icon: 'emoticon-happy',
    duration: 3000
  }
};

export default function FaceLivenessCameraScreen() {
  const navigation = useNavigation<NavigationProps>();
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  
  const [currentStep, setCurrentStep] = useState<LivenessStep>('position');
  const [stepIndex, setStepIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const progressAnim = useSharedValue(0);
  const pulseAnim = useSharedValue(1);
  const instructionAnim = useSharedValue(0);

  const stepOrder: LivenessStep[] = ['position', 'blink', 'turnLeft', 'turnRight', 'smile'];

  useEffect(() => {
    // Animate progress bar
    progressAnim.value = withTiming((stepIndex + 1) / stepOrder.length, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });

    // Animate instruction appearance
    instructionAnim.value = withSequence(
      withTiming(0, { duration: 200 }),
      withTiming(1, { duration: 300 })
    );

    // Start step timer
    const timer = setTimeout(() => {
      nextStep();
    }, STEPS[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, stepIndex]);

  useEffect(() => {
    // Pulse animation for face oval
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const nextStep = () => {
    if (stepIndex < stepOrder.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentStep(stepOrder[nextIndex]);
    } else {
      completeVerification();
    }
  };

  const completeVerification = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate random liveness score (85-98%)
      const livenessScore = Math.floor(Math.random() * 14) + 85;
      
      navigation.navigate('Processing');
      
      // Navigate to success after processing
      setTimeout(() => {
        navigation.navigate('Success', { livenessScore });
      }, 3000);
      
    } catch (error) {
      navigation.navigate('Failure', { 
        reason: 'Liveness verification failed. Please try again.' 
      });
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Verification',
      'Are you sure you want to cancel the liveness check?',
      [
        { text: 'Continue', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnim.value * 100}%`,
    };
  });

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  const instructionStyle = useAnimatedStyle(() => {
    return {
      opacity: instructionAnim.value,
      transform: [{ translateY: (1 - instructionAnim.value) * 20 }],
    };
  });

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.textTertiary} />
          <Text style={styles.permissionText}>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <GovHeader
          title="Camera Permission"
          showBack={true}
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.centerContent}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.error} />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            Camera access is required for face liveness detection
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GovHeader
        title="Liveness Check"
        subtitle={`Step ${stepIndex + 1} of ${stepOrder.length}`}
        variant="transparent"
        rightAction={{
          icon: 'close',
          onPress: handleCancel,
          accessibilityLabel: 'Cancel verification'
        }}
      />

      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          animateShutter={false}
        />
        
        {/* Face Oval Overlay */}
        <View style={styles.overlay}>
          <Animated.View style={[styles.faceGuide, pulseStyle]}>
            <Svg width={280} height={360} style={styles.svg}>
              <Ellipse
                cx={140}
                cy={180}
                rx={120}
                ry={150}
                stroke={colors.accent}
                strokeWidth={3}
                fill="none"
                strokeDasharray="10,5"
              />
            </Svg>
          </Animated.View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.progressText}>
            {stepIndex + 1} / {stepOrder.length}
          </Text>
        </View>

        {/* Instructions */}
        <Animated.View style={[styles.instructionContainer, instructionStyle]}>
          <View style={styles.instructionCard}>
            <MaterialCommunityIcons
              name={STEPS[currentStep].icon}
              size={32}
              color={colors.accent}
            />
            <Text style={styles.instructionTitle}>
              {STEPS[currentStep].title}
            </Text>
            <Text style={styles.instructionText}>
              {STEPS[currentStep].instruction}
            </Text>
          </View>
        </Animated.View>

        {/* Step Indicators */}
        <View style={styles.stepIndicators}>
          {stepOrder.map((step, index) => (
            <View
              key={step}
              style={[
                styles.stepIndicator,
                index <= stepIndex && styles.stepIndicatorActive,
                index === stepIndex && styles.stepIndicatorCurrent
              ]}
            />
          ))}
        </View>

        {/* Subtle YellowSense Watermark */}
        <View style={styles.watermark}>
          <YellowSenseLogo size="small" showText={false} variant="dark" />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  progressContainer: {
    position: 'absolute',
    top: 100,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.overlayLight,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.textInverse,
    fontWeight: '600',
  },
  instructionContainer: {
    position: 'absolute',
    bottom: 120,
    left: spacing.lg,
    right: spacing.lg,
  },
  instructionCard: {
    backgroundColor: colors.overlay,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  instructionTitle: {
    ...typography.h3,
    color: colors.textInverse,
    textAlign: 'center',
  },
  instructionText: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
  },
  stepIndicators: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.overlayLight,
  },
  stepIndicatorActive: {
    backgroundColor: colors.accent,
  },
  stepIndicatorCurrent: {
    backgroundColor: colors.textInverse,
    transform: [{ scale: 1.5 }],
  },
  permissionTitle: {
    ...typography.h2,
    color: colors.textInverse,
    marginTop: spacing.md,
  },
  permissionMessage: {
    ...typography.body,
    color: colors.textInverse,
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: spacing.lg,
  },
  permissionText: {
    ...typography.body,
    color: colors.textInverse,
    marginTop: spacing.md,
  },
  permissionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  permissionButtonText: {
    ...typography.button,
    color: colors.textPrimary,
  },
  watermark: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    opacity: 0.3,
  },
});