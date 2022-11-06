const { ethers } = require("hardhat")

async function main() {
  const VNFT = await ethers.getContractFactory("VminaNFT")

  const vnft = await VNFT.deploy()
  await vnft.deployed()
  console.log("Contract deployed to address:", vnft.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
