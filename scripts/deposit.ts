import * as hre from "hardhat"
import * as fs from "fs"
import { ERC20, Apein } from "../typechain-types"

async function main() {
  const tokenDepositAddress: string = ""
  const depositAmount: string = ""

  const [deployer] = await hre.ethers.getSigners()

  const erc20abi = JSON.parse(
    fs.readFileSync("artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json", "utf8")
  ).abi

  const token: ERC20 = new (hre.ethers as any).Contract(tokenDepositAddress, erc20abi, deployer)

  const apeinDeployment = await hre.deployments.get("Apein")

  const txAppr = await token.approve(
    apeinDeployment.address,
    hre.ethers.parseUnits(depositAmount, 18)
  )
  await txAppr.wait()

  const apein: Apein = new (hre.ethers as any).Contract(
    apeinDeployment.address,
    apeinDeployment.abi,
    deployer
  )

  const txDep = await apein.deposit(tokenDepositAddress, hre.ethers.parseUnits(depositAmount, 18))
  await txDep.wait()

  const txBal: bigint = await token.balanceOf(apeinDeployment.address)
  console.log(`Apein "${await token.name()}" balance is: ${txBal}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
