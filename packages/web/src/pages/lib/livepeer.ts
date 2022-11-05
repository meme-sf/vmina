import { createReactClient, studioProvider } from '@livepeer/react';

export const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_LIVEPEER_API_KEY,
  }),
});
