import { LivepeerConfig } from '@livepeer/react';
import '../styles/globals.css';
import type { AppProps } from 'next/app';

import { livepeerClient } from './lib/livepeer';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LivepeerConfig client={livepeerClient}>
      <Component {...pageProps} />
    </LivepeerConfig>
  );
}
