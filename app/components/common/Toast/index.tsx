import React from 'react';
import Toast from 'react-native-toast-message';
import toastConfig from './ToastConfig';

export { toastConfig };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toast config={toastConfig} />
    </>
  );
};

export default ToastProvider; 