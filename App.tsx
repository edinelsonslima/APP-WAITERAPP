import { useFonts } from 'expo-font';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import styled from 'styled-components/native';
import { Logo } from './src/components/Icons/Logo';

import { Main } from './src/Main/Index';

export default function App() {
  const [isFontsLoaded] = useFonts({
    'GeneralSans-400': require('./src/assets/fonts/GeneralSans-Regular.otf'),
    'GeneralSans-600': require('./src/assets/fonts/GeneralSans-Semibold.otf'),
    'GeneralSans-700': require('./src/assets/fonts/GeneralSans-Bold.otf'),
  });

  if (!isFontsLoaded){
    return (
      <LogoContainer>
        <StatusBar style='light'/>
        <Logo/>
        <Text style={{marginTop: 24, fontSize: 32, fontWeight: '600', color: '#FFF'}} >
          WAITER
          <Text style={{fontSize: 32, color: '#FFF'}}>
            APP
          </Text>
        </Text>
        <Text style={{marginTop: 6, fontSize: 16, color: '#FFF'}}>
          O App do Garçom
        </Text>
      </LogoContainer>
    );
  }

  return (
    <>
      <Main/>
      <StatusBar style='dark' backgroundColor='#FAFAFA'/>
    </>
  );
}


const LogoContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;

  background: #D73035;
`;
