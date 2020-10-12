const { expect } = require('chai')
const parseEther = require('ethers').utils.parseEther

describe('Farm', () => {
  describe('Farm', async () => {
    const { deployer, investor } = await getNamedAccounts()
    const deployerSigner = await ethers.getSigner(deployer)
    const investorSigner = await ethers.getSigner(investor)

    const DaiToken = await ethers.getContractFactory('DaiToken')
    const DeployToken = await ethers.getContractFactory('DeployToken')
    const Farm = await ethers.getContractFactory('Farm')

    let daiToken, deployToken, farm

    beforeEach(async () => {
      daiToken = await DaiToken.deploy()
      deployToken = await DeployToken.deploy()
      farm = await Farm.deploy(deployToken.address, daiToken.address)
      // Send to investor 100 DAI
      await daiToken.transfer(investor, parseEther('100'))
      // Send to farm 500 DPL
      await deployToken.transfer(farm.address, parseEther('500'))
    })

    describe('Tokens deployment', async () => {
      it('deployed', async () => {
        expect(await daiToken.name()).to.eq('Dai Token')
        expect(await deployToken.name()).to.eq('Deploy Token')
      })
    })

    describe('Farming tokens', async () => {
      it('flow', async () => {
        // 1. Check investor's DAI balance
        expect(await daiToken.balanceOf(investor)).to.eq(parseEther('100'))

        // 2. Stake DAI tokens
        // await daiToken.approve(farm.address, parseEther('100'), { value: parseEther('1') })
        await daiToken.connect(investorSigner).approve(farm.address, parseEther('100'))
        await farm.connect(investorSigner).stakeTokens(parseEther('100'), daiToken.address)

        // 3. Check balances after staking
        expect(await daiToken.balanceOf(investor)).to.eq(parseEther('0'))
        expect(await daiToken.balanceOf(farm.address)).to.eq(parseEther('100'))

        expect(await farm._stakingBalance(investor)).to.eq(parseEther('100'))
        expect(await farm._isStaking(investor)).to.eq(true)
        expect(await farm._hasStaked(investor)).to.eq(true)

        // 4. issueTokens()
        await farm.issueTokens()
        // only owner can issue tokens
        await expect(farm.connect(investorSigner).issueTokens()).to.be.revertedWith('Caller must be the owner')

        // 5. Check deployToken balances after issuance
        expect(await deployToken.balanceOf(investor)).to.eq(parseEther('100'))

        // 6. Unstake tokens
        await farm.connect(investorSigner).unstakeTokens()

        // 7. Check balances after unstaking
        expect(await daiToken.balanceOf(investor)).to.eq(parseEther('100'))
        expect(await daiToken.balanceOf(farm.address)).to.eq(parseEther('0'))

        expect(await farm._stakingBalance(investor)).to.eq(parseEther('0'))
        expect(await farm._isStaking(investor)).to.eq(false)
      })
    })
  })
})
