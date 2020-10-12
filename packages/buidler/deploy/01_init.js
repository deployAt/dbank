module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments
  const { deployer, investor } = await getNamedAccounts()
  const deployerSigner = await ethers.getSigner(deployer)

  console.log('Deploying DAI')
  await deploy('DaiToken', {
    from: deployer,
    log: true,
  })

  console.log('Deploying DPL')
  await deploy('DeployToken', {
    from: deployer,
    log: true,
  })

  const daiToken = await ethers.getContract('DaiToken', deployerSigner)
  const deployToken = await ethers.getContract('DeployToken', deployerSigner)

  await deploy('Farm', {
    from: deployer,
    args: [deployToken.address, daiToken.address],
    log: true,
  })
}
