import '../styles/globals.css';
import { ChakraProvider } from '@chakra-ui/react';
import { LivepeerConfig } from '@livepeer/react';
import { getDefaultProvider } from 'ethers';
import type { AppProps } from 'next/app';
import { createClient, WagmiConfig } from 'wagmi';

import Header from 'components/Header';

import { livepeerClient } from '../lib/livepeer';
import { setupMina } from '../lib/mina';

setupMina();
const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={client}>
      <LivepeerConfig client={livepeerClient}>
        <ChakraProvider>
          <Header />
          <Component {...pageProps} />
        </ChakraProvider>
      </LivepeerConfig>
    </WagmiConfig>
  );
}
