import { useState } from 'react';
import { FlatList } from 'react-native';
import { Category } from '../../types/Category';
import { Text } from '../Text';

import {CategoryContainer, Icon} from './styles';

interface CategoryProps {
  categories: Category[];
  onSelectCategory: (categoryId: string) => Promise<void>;
}

export function Categories( { categories, onSelectCategory }: CategoryProps) {

  const [selectedCategory, setSelectedCategory] = useState('');

  function handleSelectCategory(categoryId: string) {
    const category = selectedCategory === categoryId ? '' : categoryId;
    setSelectedCategory(category);
    onSelectCategory(category);
  }

  return (
    <FlatList
      horizontal
      data={categories}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingRight: 24}}
      keyExtractor={({_id}) => _id}
      renderItem={({item: {_id, icon, name}}) => {
        const isSelected = selectedCategory === _id;
        return (
          <CategoryContainer onPress={() => handleSelectCategory(_id)}>
            <Icon>
              <Text opacity={isSelected ? 1 : 0.5}>{icon}</Text>
            </Icon>

            <Text
              size={14}
              weight='600'
              opacity={isSelected ? 1 : 0.5}
            >
              {name}
            </Text>
          </CategoryContainer>
        );
      }}
    />
  );
}

