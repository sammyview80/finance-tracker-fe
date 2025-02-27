import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { styles } from '../styles';

interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  type: 'income' | 'expense';
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  type,
  error
}) => {
  const filteredCategories = categories.filter(cat => cat.type === type);
  
  return (
    <>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoryScrollContainer}
      >
        {filteredCategories && filteredCategories.length > 0 ? (
          filteredCategories.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.selectedCategory
              ]}
              onPress={() => onSelectCategory(cat.id)}
            >
              <ThemedText 
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.selectedCategoryText
                ]}
              >
                {cat.name}
              </ThemedText>
            </Pressable>
          ))
        ) : (
          <ThemedText style={styles.noCategoriesText}>
            No {type} categories found
          </ThemedText>
        )}
      </ScrollView>
      {error && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
    </>
  );
};