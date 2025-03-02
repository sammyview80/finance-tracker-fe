import { StyleSheet } from 'react-native';

// We'll create a function that returns styles based on the theme
export const createModalStyles = (isDark: boolean) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: isDark ? '#666' : '#CCCCCC',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
});

// For backward compatibility, export a default version with dark theme
export const baseModalStyles = createModalStyles(true);

export default baseModalStyles;