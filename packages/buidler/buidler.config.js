usePlugin('@nomiclabs/buidler-waffle')
usePlugin('buidler-ethers-v5')
usePlugin('buidler-deploy')

module.exports = {
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: false,
      runs: 200,
    },
  },
  networks: {
    buidlerevm: {
      gas: 'auto',
      // loggingEnabled: true,
    },
    localhost: {
      url: 'http://localhost:8545',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/xxx',
      accounts: [`0x${'xxx'}`],
    },
  },
  namedAccounts: {
    deployer: 0,
    investor: 1,
  },
  paths: {
    sources: 'contracts',
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
  },
}
