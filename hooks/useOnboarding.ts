import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@finance_tracker:onboarding_complete';

export function useOnboarding() {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setIsOnboardingComplete(value === 'true');
    } catch (e) {
      console.error('Error reading onboarding status:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setIsOnboardingComplete(true);
    } catch (e) {
      console.error('Error saving onboarding status:', e);
    }
  };

  return {
    isLoading,
    isOnboardingComplete,
    completeOnboarding
  };
}