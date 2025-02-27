import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#666',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#CCC',
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 10,
    padding: 15,
    color: '#FFF',
    fontSize: 16,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 5,
  },
  remarksInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  suggestionsContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  suggestionChip: {
    backgroundColor: '#3A3A3A',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#555',
  },
  activeSuggestion: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  suggestionText: {
    color: '#FFF',
    fontSize: 14,
  },
  categoryScrollContainer: {
    marginVertical: 8,
  },
  categoryChip: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#444',
    minWidth: 100,
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryText: {
    color: '#CCC',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  noCategoriesText: {
    color: '#999',
    fontStyle: 'italic',
    padding: 10,
  },
  dateButton: {
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  dateText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerInline: {
    marginTop: 10,
    backgroundColor: '#2C2C2C',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  datePicker: {
    backgroundColor: Platform.OS === 'ios' ? '#2C2C2C' : undefined,
    borderRadius: 10,
    ...(Platform.OS === 'ios' && {
      height: 200,
    }),
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#2C5F2E',
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});