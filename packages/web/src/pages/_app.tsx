import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { LivepeerConfig } from '@livepeer/react';
import type { AppProps } from 'next/app';

import Header from 'components/Header';

import { livepeerClient } from '../lib/livepeer';
import { setupMina } from '../lib/mina';

setupMina();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LivepeerConfig client={livepeerClient}>
      <ChakraProvider>
        <Header />
        <Component {...pageProps} />
      </ChakraProvider>
    </LivepeerConfig>
  );
}
