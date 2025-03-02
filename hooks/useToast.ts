import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

export const useToast = () => {
  const showToast = (title: string, message: string, type: ToastType = 'info') => {
    Toast.show({
      type,
      text1: title,
      text2: message,
      position: 'bottom',
      visibilityTime: 4000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const hideToast = () => {
    Toast.hide();
  };

  return {
    showToast,
    hideToast,
  };
}; 