require('dotenv').config()
usePlugin('buidler-ethers-v5')
usePlugin('buidler-deploy')

const { INFURA_KEY, MNEMONIC, PRIVATE_KEY_RINKEBY, PRIVATE_KEY_KOVAN, PRIVATE_KEY_KOVAN_2 } = process.env

module.exports = {
  networks: {
    buidlerevm: {
      gas: 'auto',
      // loggingEnabled: true,
    },
    localhost: {
      url: 'http://localhost:8545',
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/' + INFURA_KEY,
      accounts: [PRIVATE_KEY_KOVAN, PRIVATE_KEY_KOVAN_2],
      gas: 'auto',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + INFURA_KEY,
      accounts: [PRIVATE_KEY_RINKEBY],
      gas: 'auto',
    },
  },
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: false,
      runs: 200,
    },
  },
  namedAccounts: {
    deployer: 0,
    user: 1,
  },
  paths: {
    sources: 'contracts',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
  },
}
