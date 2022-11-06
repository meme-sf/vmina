import { providers, Wallet, Contract, utils } from 'ethers'
import type { NextApiRequest, NextApiResponse } from 'next'

const PRIVATE_KEY = process.env.NEXT_PUBLIC_PRIVATE_KEY || "0x";
const API_URL = process.env.NEXT_PUBLIC_MUMBAI_URL || "hogehoge";
const provider = new providers.JsonRpcProvider(API_URL);
const contract = require('../../contracts/VminaNFT.json');
const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x";
const signer = new Wallet(PRIVATE_KEY, provider);
const contractInterface = new utils.Interface(contract.abi as any)
const VNFTContract = new Contract(contractAddress, contractInterface, signer);

const mint = async (address: string, tokenUri: any) => {
  const receipt = await VNFTContract.mintNFT(address, tokenUri, { gasLimit: 1000000, maxFeePerGas: 1000000, maxPriorityFeePerGas: 1000000 })
  return receipt
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = {
    'imagePath': req.body.imagePath
  }
  const receipt = await mint(req.body.address, JSON.stringify(data))
  if(receipt.hash) res.status(200).json({ hash: receipt.hash })
  if(!receipt.hash) res.status(500)
};
export default handler;
