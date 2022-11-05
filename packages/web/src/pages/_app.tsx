import { LivepeerConfig } from '@livepeer/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react'
import { livepeerClient } from './lib/livepeer';
import Header from 'components/Header';

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
