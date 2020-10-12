module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments
  const { deployer, investor } = await getNamedAccounts()
  const deployerUser = await ethers.getSigner(deployer)

  console.log('DEPLOYING DAI')
  await deploy('DAI', {
    contract: 'DaiToken',
    from: deployer,
    log: true,
  })
}
