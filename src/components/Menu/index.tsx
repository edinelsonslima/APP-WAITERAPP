import { FlatList } from 'react-native';
import { formatCurrency } from '../../utils/formatCurrency';
import { Text } from '../Text';

import { PlusCircle } from '../Icons/PlusCircle';

import {
  ProductContainer,
  ProductImage,
  ProductDetails,
  Separator,
  AddToCartButton} from './styles';
import { ProductModal } from '../ProductModal';
import { useState } from 'react';
import { Product } from '../../types/Product';

interface MenuProps {
  onAddToCart: (product: Product) => void;
  products: Product[];
}

export function Menu({ onAddToCart, products }: MenuProps) {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleOpenModal(product: Product){
    setIsModalVisible(true);
    setSelectedProduct(product);
  }

  return (
    <>
      <ProductModal
        onAddToCart={onAddToCart}
        visible={isModalVisible}
        product={selectedProduct}
        onClose={() => setIsModalVisible(false)}
      />


      <FlatList
        data={products}
        style={{marginTop: 32}}
        ItemSeparatorComponent={Separator}
        keyExtractor={({_id}) => _id}
        contentContainerStyle={{paddingHorizontal: 24}}
        renderItem={({item: product}) => (
          <ProductContainer onPress={() => handleOpenModal(product)}>
            <ProductImage
              source={{
                uri: `http://192.168.3.57:3001/uploads/${product.imagePath}`,
              }}
            />

            <ProductDetails>
              <Text weight='600'>{product.name}</Text>
              <Text size={14} color='#666' style={{marginVertical: 8}}>
                {product.description}
              </Text>
              <Text size={14} weight='600'>{formatCurrency(product.price)}</Text>
            </ProductDetails>

            <AddToCartButton onPress={() => onAddToCart(product)}>
              <PlusCircle/>
            </AddToCartButton>
          </ProductContainer>
        )}
      />
    </>
  );
}
