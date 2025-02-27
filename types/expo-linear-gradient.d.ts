declare module 'expo-linear-gradient' {
  import { ViewProps } from 'react-native';
  
  interface LinearGradientProps extends ViewProps {
    colors: string[];
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  }

  export class LinearGradient extends React.Component<LinearGradientProps> {}
}