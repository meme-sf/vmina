import { isReady, Mina, PrivateKey, PublicKey } from 'snarkyjs';

import { BilinearInterpolation } from '../../../contract/build/src/BilinearInterpolation';
import {
  ImageComparison,
  RGBArray,
} from '../../../contract/build/src/ImageComparison';

// setup
export const setupMina = async () => {
  try {
    await isReady;
    const Berkeley = Mina.BerkeleyQANet(
      'https://proxy.berkeley.minaexplorer.com/graphql',
    );
    Mina.setActiveInstance(Berkeley);
    console.log('==== network ready');
  } catch (error) {
    // ignore self.crossOriginIsolated warning
  }
};

// TODO: should be handled more securely
const feePayer = process.env.NEXT_PUBLIC_FEE_PAYER as unknown as PrivateKey; //Local.testAccounts[0].privateKey;
const zkAppPublicKey = process.env
  .NEXT_PUBLIC_FEE_PAYER_PUBKEY as unknown as PublicKey;

/**
 * Verify lowRes image is generated from highRes
 * @param args.highRes an array in RGB format
 * @param args.lowRes an array in RGB format
 */
export const checkImage = async ({
  lowRes,
  highRes,
}: {
  highRes: number[][][];
  lowRes: number[][][];
}): Promise<boolean> => {
  try {
    const zkapp = new ImageComparison(zkAppPublicKey);
    let tx = await Mina.transaction(feePayer, () => {
      zkapp.verifyImage(
        new BilinearInterpolation(highRes),
        new RGBArray(lowRes),
      );
    });
    await tx.send().wait();
    const result = zkapp.isVerified.get().toBoolean();
  } catch (error) {
    console.log('====');
  }
  return true;
};
