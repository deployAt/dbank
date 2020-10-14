const parseEther = require('ethers').utils.parseEther
const formatEther = require('ethers').utils.formatEther

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments
  const { deployer, user } = await getNamedAccounts()
  const userSigner = await ethers.getSigner(user)
  const deployerSigner = await ethers.getSigner(deployer)

  const INIT_TOKEN_SUPPLY = parseEther('1000')

  // 1. Deployment
  console.log('----Deploying DPL')
  await deploy('DeployToken', {
    contract: 'ERC20Log',
    from: deployer,
    args: [INIT_TOKEN_SUPPLY, 'DeployToken', 'DPL'],
    log: true,
  })
  // const deployToken = await ethers.getContract('DeployToken', deployerSigner)
  const deployToken = await ethers.getContract('DeployToken')

  console.log('----Deploying DAI')
  await deploy('DaiToken', {
    contract: 'ERC20Log',
    from: deployer,
    args: [INIT_TOKEN_SUPPLY, 'DaiToken', 'DAI'],
    log: true,
  })
  const daiToken = await ethers.getContract('DaiToken')

  // console.log('----Deploying LINK')
  // await deploy('LINKToken', {
  //   contract: 'ERC20Log',
  //   from: deployer,
  //   args: [INIT_TOKEN_SUPPLY, 'LINKToken', 'LINK'],
  //   log: true,
  // })

  // const linkToken = await ethers.getContract('LINKToken')

  await deploy('Farm', {
    from: deployer,
    args: [deployToken.address],
    log: true,
  })
  const farm = await ethers.getContract('Farm')

  // 2. Add allowed tokens
  await farm.addAllowedTokens(daiToken.address)
  // await farm.addAllowedTokens(linkToken.address)

  // 3. Transfer 1000 DeployToken to the Farm contract
  await deployToken.transfer(farm.address, parseEther('1000'))

  // 4. Transfer 500 DAI and 500 LINK to the User
  await daiToken.transfer(user, parseEther('500'))
  // await linkToken.transfer(user, parseEther('500'))

  // send LINK to farm contract
  const linkTokenKovan = await ethers.getContractAt(
    'IERC20',
    '0xa36085f69e2889c224210f603d836748e7dc0088',
    deployerSigner
  )
  await linkTokenKovan.transfer(farm.address, parseEther('1'))
  console.log('Farm link token:', formatEther(await linkTokenKovan.balanceOf(farm.address)))

  await daiToken.connect(userSigner).approve(farm.address, parseEther('1'))
  await farm.connect(userSigner).stakeTokens(parseEther('1'), daiToken.address)

  await farm.issueTokens()

  await farm.connect(userSigner).unstakeTokens(daiToken.address)

  console.log('User deployToken:', formatEther(await deployToken.balanceOf(user)))
  console.log('User daiToken:', formatEther(await daiToken.balanceOf(user)))

  // // 5. User stakes 100 DAI & 100 LINK
  // await daiToken.connect(userSigner).approve(farm.address, parseEther('100'))
  // await farm.connect(userSigner).stakeTokens(parseEther('80'), daiToken.address)
  // await farm.connect(userSigner).stakeTokens(parseEther('20'), daiToken.address)

  // await linkToken.connect(userSigner).approve(farm.address, parseEther('100'))
  // await farm.connect(userSigner).stakeTokens(parseEther('100'), linkToken.address)

  // // 6. Issue Tokens
  // await farm.issueTokens()

  // // 7. Check User's balances
  // console.log('User deployToken:', formatEther(await deployToken.balanceOf(user)))
  // console.log('User daiToken:', formatEther(await daiToken.balanceOf(user)))
  // console.log('User linkToken:', formatEther(await linkToken.balanceOf(user)))

  // // 8.  User unstakes 100 DAI & 100 LINK
  // await farm.connect(userSigner).unstakeTokens(daiToken.address)
  // await farm.connect(userSigner).unstakeTokens(linkToken.address)

  // // 9. Check User's balances
  // console.log('User deployToken:', formatEther(await deployToken.balanceOf(user)))
  // console.log('User daiToken:', formatEther(await daiToken.balanceOf(user)))
  // console.log('User linkToken:', formatEther(await linkToken.balanceOf(user)))
}
