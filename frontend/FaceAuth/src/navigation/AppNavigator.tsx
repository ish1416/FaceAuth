import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

// Import all screens
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import FaceAuthInstructionsScreen from '../screens/FaceAuthInstructionsScreen';
import FaceLivenessCameraScreen from '../screens/FaceLivenessCameraScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import SuccessScreen from '../screens/SuccessScreen';
import FailureScreen from '../screens/FailureScreen';
import DashboardScreen from '../screens/DashboardScreen';
import HelpScreen from '../screens/HelpScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Splash"
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: false, // Disable swipe back for security
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="FaceInstructions" component={FaceAuthInstructionsScreen} />
        <Stack.Screen name="FaceLivenessCamera" component={FaceLivenessCameraScreen} />
        <Stack.Screen name="Processing" component={ProcessingScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} />
        <Stack.Screen name="Failure" component={FailureScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}