import { isReady, shutdown, Mina, PrivateKey, AccountUpdate } from 'snarkyjs';
import { RGBArray, ImageComparison } from './ImageComparison.js';
import fs from 'fs';
import { BilinearInterpolation } from './BilinearInterpolation.js';
(async function main() {
    await isReady;
    console.log('SnarkyJS loaded');
    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;
    // The public key is our address and where we will deploy to
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    const testfile = fs.readFileSync('input/slice0.json', 'utf8');
    const testLowResfile = fs.readFileSync('input/slice1.json', 'utf8');
    const original = JSON.parse(testfile).in;
    const lowRes = JSON.parse(testLowResfile).in;
    console.log(original[0][0]);
    console.log(lowRes[0][0]);
    const contract = new ImageComparison(zkAppAddress);
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount);
        contract.deploy({ zkappKey: zkAppPrivateKey });
    });
    await deployTxn.send().wait();
    // check
    try {
        // Some how this request throws an error after everything completes
        // For now we make it silent
        await Mina.transaction(deployerAccount, () => {
            contract.verifyImage(new BilinearInterpolation(original), new RGBArray(lowRes));
            contract.sign(zkAppPrivateKey);
        });
    }
    catch (error) {
        // Do nothing
    }
    console.log('Shutting down');
    await shutdown();
})();
