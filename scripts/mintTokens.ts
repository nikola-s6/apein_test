import { HardhatRuntimeEnvironment } from "hardhat/types"
const hre: HardhatRuntimeEnvironment = require("hardhat")
import * as fs from "fs"
import { Token as Tkn, TokensJson } from "../types/Tokens"
import { TokenFactory, Token } from "../typechain-types"

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  const tf = await hre.deployments.get("TokenFactory")
  const tokenFactory: TokenFactory = new (hre.ethers as any).Contract(tf.address, tf.abi, deployer)

  const tx = await tokenFactory.mintTokens(3, hre.ethers.parseEther("1000"))
  await tx.wait()

  const tokenAddresses: string[] = await tokenFactory.getAvailableTokens()
  const tokenAbi = JSON.parse(
    fs.readFileSync("artifacts/contracts/Token.sol/Token.json", "utf8")
  ).abi
  const obj: TokensJson = {
    tokens: [],
  }

  for (var address of tokenAddresses) {
    const token: Token = new (hre.ethers as any).Contract(address, tokenAbi, deployer)
    const name: string = await token.name()
    const symbol: string = await token.symbol()
    const weight: string = hre.ethers.formatUnits(await tokenFactory.getTokenWeight(address), 0)
    const tkn: Tkn = { address, name, symbol, weight }
    obj.tokens.push(tkn)
  }

  fs.writeFileSync("utils/data/tokens.json", JSON.stringify(obj))

  console.log("New tokens minted!")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
