import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const apeinDeploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const oneInch = await deployments.get("AggregationRouterV5")

  const apein = await deploy("Apein", {
    from: deployer,
    args: [oneInch.address],
    log: true,
  })
}

export default apeinDeploy
apeinDeploy.tags = ["all", "apein"]
