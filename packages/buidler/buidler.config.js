usePlugin('@nomiclabs/buidler-waffle')

module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    buidlerevm: {},
    localhost: {
      url: 'http://localhost:8545',
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/xxx',
      accounts: [`0x${'xxx'}`],
    },
  },
  solc: {
    version: '0.6.8',
    optimizer: {
      enabled: false,
      runs: 200,
    },
  },
}
