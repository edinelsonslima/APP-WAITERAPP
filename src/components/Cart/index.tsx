import { FlatList, TouchableOpacity } from 'react-native';
import { CartItem } from '../../types/CartItem';
import { Product } from '../../types/Product';
import { formatCurrency } from '../../utils/formatCurrency';
import { Button } from '../Button';
import { MinusCircle } from '../Icons/MinusCircle';
import { PlusCircle } from '../Icons/PlusCircle';
import { Text } from '../Text';
import { OrderConfirmedModal } from '../OrderConfirmedModal';

import {
  ProductContainer,
  Actions,
  Item,
  Image,
  QuantityContainer,
  ProductDetails,
  Summary,
  Total
} from './styles';
import { useState } from 'react';
import { api } from '../../utils/api';

interface CartProps {
  cartItems: CartItem[];
  selectedTable: string;
  onConfirmOrder: () => void;
  onAdd: (product: Product) => void;
  onDecrement: (product: Product) => void;
}

export function Cart({ cartItems, onAdd, onDecrement, onConfirmOrder, selectedTable } : CartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function handleConfirmOrder() {
    setIsLoading(true);
    await api.post('/orders', {
      table: selectedTable,
      products: cartItems.map(cartItem => ({
        product: cartItem.product._id,
        quantity: cartItem.quantity
      }))
    });

    setIsLoading(false);
    setIsModalVisible(true);
  }

  function handleOk(){
    onConfirmOrder();
    setIsModalVisible(false);
  }

  const total = cartItems.reduce((acc, cartItem) => {
    return (acc + (cartItem.quantity * cartItem.product.price));
  }, 0);

  return (
    <>
      <OrderConfirmedModal visible={isModalVisible} onOk={handleOk} />

      {!!cartItems.length && (
        <FlatList
          data={cartItems}
          keyExtractor={({product}) => product._id}
          showsVerticalScrollIndicator={false}
          style={{marginBottom: 20, maxHeight: 150}}
          renderItem={({item: cartItem}) => (
            <Item>
              <ProductContainer>
                <Image source={{
                  uri:`http://192.168.3.57:3001/uploads/${cartItem.product.imagePath}`
                }}/>

                <QuantityContainer>
                  <Text size={14} color='#666'>
                    {cartItem.quantity}x
                  </Text>
                </QuantityContainer>

                <ProductDetails>
                  <Text size={14} weight='600'>{cartItem.product.name}</Text>
                  <Text size={14} color='#666' style={{marginTop: 4}}>
                    {formatCurrency(cartItem.product.price)}
                  </Text>
                </ProductDetails>
              </ProductContainer>

              <Actions>
                <TouchableOpacity style={{marginRight: 24}} onPress={() => onDecrement(cartItem.product)}>
                  <MinusCircle/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAdd(cartItem.product)}>
                  <PlusCircle/>
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}

      <Summary>
        <Total>
          {!!cartItems.length && (
            <>
              <Text color='#666'>Total</Text>
              <Text size={20} weight='600'>{formatCurrency(total)}</Text>
            </>
          )}

          {!cartItems.length && (
            <Text color='#999'>Seu carrinho está vazio</Text>
          )}
        </Total>

        <Button
          onPress={handleConfirmOrder}
          disabled={!cartItems.length}
          loading={isLoading}
        >
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
