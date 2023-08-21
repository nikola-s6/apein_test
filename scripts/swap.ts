import * as hre from "hardhat"
import * as fs from "fs"
import { TokensJson } from "../types/Tokens"
const { defaultAbiCoder } = require("@ethersproject/abi")
import { Apein, ERC20 } from "../typechain-types"

async function main() {
  const srcToken: string = ""
  const dstToken: string = ""
  const amount: string = ""

  const [deployer] = await hre.ethers.getSigners()

  const apeinDeploymnet = await hre.deployments.get("Apein")
  const oneInchDeployment = await hre.deployments.get("AggregationRouterV5")

  const erc20abi = JSON.parse(
    fs.readFileSync("artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json", "utf8")
  ).abi

  const tokensJSON: TokensJson = JSON.parse(fs.readFileSync("utils/data/tokens.json", "utf8"))

  console.log("Before swap:")
  console.log("\tApein:")
  for (let tokenInfo of tokensJSON.tokens) {
    const token: ERC20 = new (hre.ethers as any).Contract(tokenInfo.address, erc20abi, deployer)
    const balance: bigint = await token.balanceOf(apeinDeploymnet.address)
    console.log(`\t\t${tokenInfo.name}: ${balance}`)
  }
  console.log("\tOneInch:")
  for (let tokenInfo of tokensJSON.tokens) {
    const token: ERC20 = new (hre.ethers as any).Contract(tokenInfo.address, erc20abi, deployer)
    const balance: bigint = await token.balanceOf(oneInchDeployment.address)
    console.log(`\t\t${tokenInfo.name}: ${balance}`)
  }

  const apein: Apein = new (hre.ethers as any).Contract(
    apeinDeploymnet.address,
    apeinDeploymnet.abi,
    deployer
  )
  const executorDeployment = await hre.deployments.get("AggregationRouter")

  const txSwap = await apein.swapApein(
    executorDeployment.address,
    srcToken,
    dstToken,
    hre.ethers.parseEther(amount),
    "0x",
    defaultAbiCoder.encode(["address", "address"], [srcToken, dstToken])
  )
  await txSwap.wait()

  console.log("After swap:")
  console.log("\tApein:")
  for (let tokenInfo of tokensJSON.tokens) {
    const token: ERC20 = new (hre.ethers as any).Contract(tokenInfo.address, erc20abi, deployer)
    const balance: bigint = await token.balanceOf(apeinDeploymnet.address)
    console.log(`\t\t${tokenInfo.name}: ${balance}`)
  }
  console.log("\tOneInch:")
  for (let tokenInfo of tokensJSON.tokens) {
    const token: ERC20 = new (hre.ethers as any).Contract(tokenInfo.address, erc20abi, deployer)
    const balance: bigint = await token.balanceOf(oneInchDeployment.address)
    console.log(`\t\t${tokenInfo.name}: ${balance}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
