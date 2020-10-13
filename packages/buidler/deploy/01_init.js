const parseEther = require('ethers').utils.parseEther

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments
  const { deployer, investor } = await getNamedAccounts()
  const deployerSigner = await ethers.getSigner(deployer)

  const INIT_TOKEN_SUPPLY = parseEther('1000')

  console.log('----Deploying DPL')
  await deploy('DeployToken', {
    contract: 'ERC20Log',
    from: deployer,
    args: [INIT_TOKEN_SUPPLY, 'DeployToken', 'DPL'],
    log: true,
  })

  console.log('----Deploying DAI')
  await deploy('DaiToken', {
    contract: 'ERC20Log',
    from: deployer,
    args: [INIT_TOKEN_SUPPLY, 'DaiToken', 'DAI'],
    log: true,
  })

  console.log('----Deploying LINK')
  await deploy('LINKToken', {
    contract: 'ERC20Log',
    from: deployer,
    args: [INIT_TOKEN_SUPPLY, 'LINKToken', 'LINK'],
    log: true,
  })

  // console.log('Deploying DPL')
  // await deploy('DeployToken', {
  //   from: deployer,
  //   log: true,
  // })

  // const daiToken = await ethers.getContract('DaiToken', deployerSigner)
  // const deployToken = await ethers.getContract('DeployToken', deployerSigner)

  // await deploy('Farm', {
  //   from: deployer,
  //   args: [deployToken.address, daiToken.address],
  //   log: true,
  // })
}
