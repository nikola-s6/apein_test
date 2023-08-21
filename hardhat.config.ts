import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "hardhat-deploy"
import "dotenv/config"

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
          viaIR: true,
        },
      },
      {
        version: "0.4.18",
      },
    ],
  },
  defaultNetwork: "dev",
  networks: {
    dev: {
      url: process.env.RPC_URL!,
      accounts: {
        mnemonic: process.env.MNEMONIC!,
      },
      chainId: 1337,
      allowUnlimitedContractSize: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
}

export default config
