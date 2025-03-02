import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import SideDrawer from './SideDrawer';
import { BackHandler, Platform } from 'react-native';

interface DrawerContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawer must be used within a DrawerProvider');
  }
  return context;
};

interface DrawerProviderProps {
  children: ReactNode;
}

export const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Log when the component mounts to verify it's working
  useEffect(() => {
    console.log('DrawerProvider mounted');
  }, []);

  const openDrawer = () => {
    console.log('Opening drawer');
    setIsDrawerOpen(true);
  };
  
  const closeDrawer = () => {
    console.log('Closing drawer');
    setIsDrawerOpen(false);
  };
  
  const toggleDrawer = () => {
    console.log(`Toggling drawer (current state: ${isDrawerOpen ? 'open' : 'closed'})`);
    setIsDrawerOpen(prev => !prev);
  };

  // Handle back button press to close drawer if open
  useEffect(() => {
    if (Platform.OS !== 'web') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (isDrawerOpen) {
          console.log('Back button pressed while drawer open, closing drawer');
          closeDrawer();
          return true; // Prevent default back behavior
        }
        return false; // Let default back behavior happen
      });

      return () => backHandler.remove();
    }
  }, [isDrawerOpen]);

  // Log drawer state changes
  useEffect(() => {
    console.log(`Drawer state changed: ${isDrawerOpen ? 'open' : 'closed'}`);
  }, [isDrawerOpen]);

  // Create the context value
  const contextValue: DrawerContextType = {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };

  return (
    <DrawerContext.Provider value={contextValue}>
      {children}
      <SideDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </DrawerContext.Provider>
  );
};

export default DrawerProvider; 