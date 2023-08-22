import * as hre from "hardhat"
import * as fs from "fs"
import { Apein, ERC20 } from "../typechain-types"
import { TokensJson } from "../types/Tokens"

async function main() {
  const withdrawAddress: string = "0x2b11e6f5860E6541351c8d6CbBAFD9cc11207E19"

  const [deployer] = await hre.ethers.getSigners()

  const apeinDeployment = await hre.deployments.get("Apein")
  const apein: Apein = await hre.ethers.getContractAt("Apein", apeinDeployment.address, deployer)

  const erc20abi = JSON.parse(
    fs.readFileSync("artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json", "utf8")
  ).abi

  const allTokenAddresses: string[] = []
  const tokenBalances: bigint[] = []
  const tokensJSON: TokensJson = JSON.parse(fs.readFileSync("utils/data/tokens.json", "utf8"))
  for (let tokenInfo of tokensJSON.tokens) {
    allTokenAddresses.push(tokenInfo.address)
    const token: ERC20 = await hre.ethers.getContractAt("ERC20", tokenInfo.address, deployer)
    tokenBalances.push(await token.balanceOf(apeinDeployment.address))
  }

  const tx = await apein.withdraw(withdrawAddress, allTokenAddresses, tokenBalances)
  await tx.wait()

  console.log("Tokens withdrawn")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
