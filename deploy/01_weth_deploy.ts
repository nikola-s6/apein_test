import { DeployFunction } from "hardhat-deploy/dist/types"
import { HardhatRuntimeEnvironment } from "hardhat/types"

const deployWeth: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  const weth = await deploy("WETH", {
    from: deployer,
    args: [],
    log: true,
  })
}

export default deployWeth
deployWeth.tags = ["all", "weth"]
