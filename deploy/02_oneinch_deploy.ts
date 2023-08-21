import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployOneInch: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const wethContract = await deployments.get("WETH")

  const oneInch = await deploy("AggregationRouterV5", {
    from: deployer,
    args: [wethContract.address],
    log: true,
  })
}

export default deployOneInch
deployOneInch.tags = ["all", "oneinch"]
