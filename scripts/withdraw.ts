import * as hre from "hardhat"
import * as fs from "fs"
import { Apein } from "../typechain-types"

async function main() {
  const [deployer] = await hre.ethers.getSigners()

  const apeinDeployment = await hre.deployments.get("Apein")
  const apein: Apein = new (hre.ethers as any).Contract(
    apeinDeployment.address,
    apeinDeployment.abi,
    deployer
  )

  const erc20abi = JSON.parse(
    fs.readFileSync("artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json", "utf8")
  ).abi

  const allTokenAddresses: Array<string> = []
  const tokenBalances: Array<string> = []
  const tokensJSON = JSON.parse(fs.readFileSync("utils/data/tokens.json", "utf8"))
  for (let tokenInfo of tokensJSON.tokens) {
    allTokenAddresses.push(tokenInfo.address)
    const token = new hre.ethers.Contract(tokenInfo.address, erc20abi, deployer)
    tokenBalances.push(await token.balanceOf(apeinDeployment.address))
  }

  const tx = await apein.withdraw(deployer, allTokenAddresses, tokenBalances)
  await tx.wait()

  console.log("Tokens withdrawn")
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
