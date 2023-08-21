import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const tokenFactoryDeploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const tokenFactory = await deploy("TokenFactory", {
    from: deployer,
    args: [],
    log: true,
  })
}

export default tokenFactoryDeploy
tokenFactoryDeploy.tags = ["all", "tokenfactory"]
