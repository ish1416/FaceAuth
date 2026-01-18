export type RootStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  FaceInstructions: undefined;
  FaceLivenessCamera: undefined;
  Processing: undefined;
  Success: { livenessScore: number };
  Failure: { reason: string };
  Dashboard: undefined;
  Help: undefined;
};

export type NavigationProps = {
  navigate: (screen: keyof RootStackParamList, params?: any) => void;
  goBack: () => void;
  reset: (options: any) => void;
};