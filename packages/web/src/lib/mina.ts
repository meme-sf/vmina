import { Mina, PublicKey } from 'snarkyjs';

// setup
const Local = Mina.LocalBlockchain();
Mina.setActiveInstance(Local);

// TODO: connect with the testnet?
const feePayer = Local.testAccounts[0].privateKey;

/**
 * Verify lowRes image is generated from highRes
 * @param param0
 */
const checkImage = async ({
  zkappAddress,
  lowRes,
  highRes,
}: {
  zkappAddress: PublicKey;
  lowRes: number[][];
  highRes: number[][];
}): Promise<boolean> => {
  try {
    let tx = await Mina.transaction(feePayer, () => {
      // TODO: Add image inputs
      // zkapp.checkImage(new BilinearInterpolation(json));
    });
    await tx.send().wait();
    // TODO: get result
    // const result = await zkapp.getResult();
  } catch (error) {
    console.log('====');
  }
  return true;
};
