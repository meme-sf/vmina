import {
  isReady,
  shutdown,
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'snarkyjs';
import { Add } from './Add.js';
import fs from 'fs';

(async function main() {
  await isReady;
  console.log('SnarkyJS loaded');
  const Local = Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);
  // eslint-disable-next-line no-unused-vars
  const deployerAccount = Local.testAccounts[0].privateKey;

  // The public key is our address and where we will deploy to
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const contract = new Add(zkAppAddress);
  const deployTxn = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    contract.deploy({ zkappKey: zkAppPrivateKey });
    contract.init();
    contract.sign(zkAppPrivateKey);
  });
  await deployTxn.send().wait();

  const txn1 = await Mina.transaction(deployerAccount, () => {
    contract.update();
    contract.sign(zkAppPrivateKey);
  });

  console.log('Shutting down');
  await shutdown();
})();
