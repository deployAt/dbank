const { expect } = require('chai')
const parseEther = require('ethers').utils.parseEther

describe('Farm', () => {
  let DaiToken, DeployToken, Farm //contract factory
  let daiToken, deployToken, farm
  let owner, ownerAddress, investor, investorAddress

  before(async () => {
    const accounts = await ethers.getSigners()
    owner = await accounts[0]
    ownerAddress = await accounts[0].getAddress()
    investor = await accounts[1]
    investorAddress = await accounts[1].getAddress()
    DaiToken = await ethers.getContractFactory('DaiToken')
    DeployToken = await ethers.getContractFactory('DeployToken')
    Farm = await ethers.getContractFactory('Farm')
  })

  beforeEach(async () => {
    daiToken = await DaiToken.deploy()
    deployToken = await DeployToken.deploy()
    farm = await Farm.deploy(deployToken.address, daiToken.address)
    // Send to investor 100 DAI
    await daiToken.transfer(investorAddress, parseEther('100'))
  })

  describe('Dai Token deployment', async () => {
    it('has a name', async () => {
      expect(await daiToken.name()).to.eq('Dai Token')
    })
  })

  describe('Deploy Token deployment', async () => {
    it('has a name', async () => {
      expect(await deployToken.name()).to.eq('Deploy Token')
    })
  })

  describe('Farming tokens', async () => {
    it('staking', async () => {
      // 1. Check investor's DAI balance
      expect(await daiToken.balanceOf(investorAddress)).to.eq(parseEther('100'))

      // // 2. Stake DAI tokens
      await daiToken.connect(investor).approve(farm.address, parseEther('100'))
      await farm.connect(investor).stakeTokens(parseEther('100'), daiToken.address)

      // 3. Check balances
      expect(await daiToken.balanceOf(investorAddress)).to.eq(parseEther('0'))
      expect(await daiToken.balanceOf(farm.address)).to.eq(parseEther('100'))
    })
  })
})
