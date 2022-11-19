import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Button } from '../components/Button';
import { Cart } from '../components/Cart';
import { Categories } from '../components/Categories';
import { Header } from '../components/Header';
import { Menu } from '../components/Menu';
import { TableModal } from '../components/TableModa';
import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product';
import { Text } from '../components/Text';
import { Empty } from '../components/Icons/Empty';
import {
  CategoriesContainer,
  Container,
  Footer,
  FooterContainer,
  MenuContainer,
  CenteredContainer
} from './styles';
import { Category } from '../types/Category';
import { api } from '../utils/api';


export function Main () {
  const [isTableModalVisible, setIsTableModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);


  function handleSaveTable(table: string) {
    setSelectedTable(table);
  }

  function handleResetOrder() {
    setSelectedTable('');
    setCartItems([]);
  }

  function handleAddToCart(product: Product) {
    if(!selectedTable){
      setIsTableModalVisible(true);
    }

    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);

      if(itemIndex < 0) {
        return [...prevState, { product, quantity: 1 }];
      }

      const newCartItems = [...prevState];
      const item = newCartItems[itemIndex];
      newCartItems[itemIndex].quantity = item.quantity + 1;

      return newCartItems;
    });
  }

  function handleDecrementCartItem(product: Product) {
    setCartItems((prevState) => {
      const itemIndex = prevState.findIndex(cartItem => cartItem.product._id === product._id);
      const item = prevState[itemIndex];
      const newCartItems = [...prevState];

      if(item.quantity === 1) {
        newCartItems.splice(itemIndex, 1);
        return newCartItems;
      }

      newCartItems[itemIndex].quantity = item.quantity - 1;
      return newCartItems;
    });
  }

  async function handleSelectedCategory(categoryId: string) {
    setIsLoadingProducts(true);
    const route = !categoryId
      ? '/products'
      : `/categories/${categoryId}/products`;

    const { data } = await api.get(route);
    setProducts(data);
    setIsLoadingProducts(false);
  }

  useEffect(() => {
    Promise.all([
      api.get<Category[]>('/categories'),
      api.get<Product[]>('/products')
    ]).then(([{data: categories}, {data: products}]) => {
      setCategories(categories);
      setProducts(products);
      setIsLoading(false);
    });
  }, []);

  return(
    <>
      <Container>
        <Header
          selectedTable={selectedTable}
          onCancelOrder={handleResetOrder}
        />

        {!!isLoading && (
          <CenteredContainer>
            <ActivityIndicator size='large' color='#D73035'/>
          </CenteredContainer>
        )}

        {!isLoading &&(
          <>
            <CategoriesContainer>
              <Categories
                categories={categories}
                onSelectCategory={handleSelectedCategory}
              />
            </CategoriesContainer>

            {isLoadingProducts && (
              <CenteredContainer>
                <ActivityIndicator size='large' color='#D73035'/>
              </CenteredContainer>
            )}

            {!isLoadingProducts && (
              <>
                {!products.length && (
                  <CenteredContainer>
                    <Empty/>
                    <Text color='#666' style={{marginTop: 24}}>Nenhum produto foi encontrado</Text>
                  </CenteredContainer>
                )}

                {!!products.length && (
                  <MenuContainer>
                    <Menu onAddToCart={handleAddToCart} products={products}/>
                  </MenuContainer>
                )}
              </>
            )}
          </>
        )}

      </Container>

      <Footer>
        <FooterContainer>
          {!selectedTable &&
            <Button
              disabled={isLoading}
              onPress={() => setIsTableModalVisible(true)}
            >
              Novo Pedido
            </Button>
          }

          {selectedTable && (
            <Cart
              cartItems={cartItems}
              onAdd={handleAddToCart}
              selectedTable={selectedTable}
              onConfirmOrder={handleResetOrder}
              onDecrement={handleDecrementCartItem}
            />
          )}
        </FooterContainer>
      </Footer>

      <TableModal
        visible={isTableModalVisible}
        onClose={() => setIsTableModalVisible(false)}
        onSave={handleSaveTable}
      />
    </>
  );
}
