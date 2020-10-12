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
    // Send to farm 500 DPL
    await deployToken.transfer(farm.address, parseEther('500'))
  })

  describe('Tokens deployment', async () => {
    it('deployed', async () => {
      expect(await daiToken.name()).to.eq('Dai Token')
      expect(await deployToken.name()).to.eq('Deploy Token')

    })
  })

  describe.only('Farming tokens', async () => {
    it('flow', async () => {
      // 1. Check investor's DAI balance
      expect(await daiToken.balanceOf(investorAddress)).to.eq(parseEther('100'))

      // 2. Stake DAI tokens
      // await daiToken.approve(farm.address, parseEther('100'), { value: parseEther('1') })
      await daiToken.connect(investor).approve(farm.address, parseEther('100'))
      await farm.connect(investor).stakeTokens(parseEther('100'), daiToken.address)

      // 3. Check balances after staking
      expect(await daiToken.balanceOf(investorAddress)).to.eq(parseEther('0'))
      expect(await daiToken.balanceOf(farm.address)).to.eq(parseEther('100'))

      expect(await farm._stakingBalance(investorAddress)).to.eq(parseEther('100'))
      expect(await farm._isStaking(investorAddress)).to.eq(true)
      expect(await farm._hasStaked(investorAddress)).to.eq(true)

      // 4. issueTokens()
      await farm.issueTokens()
        // only owner can issue tokens
      await expect(farm.connect(investor).issueTokens()).to.be.revertedWith('Caller must be the owner')

      // 5. Check deployToken balances after issuance
      expect(await deployToken.balanceOf(investorAddress)).to.eq(parseEther('100'))

      // 6. Unstake tokens
      await farm.connect(investor).unstakeTokens()

      // 7. Check balances after unstaking
      expect(await daiToken.balanceOf(investorAddress)).to.eq(parseEther('100'))
      expect(await daiToken.balanceOf(farm.address)).to.eq(parseEther('0'))

      expect(await farm._stakingBalance(investorAddress)).to.eq(parseEther('0'))
      expect(await farm._isStaking(investorAddress)).to.eq(false)
    })
  })
})
