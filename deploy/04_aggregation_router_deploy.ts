import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const aggregationRouterDeploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const exchange = await deployments.get("TokenFactory")

  const aggregationRouter = await deploy("AggregationRouter", {
    from: deployer,
    args: [exchange.address],
    log: true,
  })
}

export default aggregationRouterDeploy
aggregationRouterDeploy.tags = ["all", "aggregation"]
