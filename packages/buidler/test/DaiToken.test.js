const expect = require('./chai-setup').expect
const bre = require('@nomiclabs/buidler')
// const ethers = require('ethers')
const ethers = require('@nomiclabs/buidler').ethers
const getNamedAccounts = require('@nomiclabs/buidler').getNamedAccounts

const parseEther = require('ethers').utils.parseEther
const deploy = bre.deployments.deploy

console.log(expect)

describe('DaiToken', () => {
  let DaiToken // contract factory
  let token, wallet, walletTo, deployerSigner

  before(async () => {
    const { deployer, user } = await getNamedAccounts()
    wallet = deployer
    walletTo = user
    deployerSigner = await ethers.getSigner(deployer)
  })

  beforeEach(async () => {
    await deploy('DaiToken', {
      // contract: 'ERC20Log',
      from: wallet,
      // args: [INIT_TOKEN_SUPPLY, 'DeployToken', 'DPL'],
      log: true,
    })

    token = await ethers.getContract('DaiToken', deployerSigner)

    // token = await DaiToken.deploy()
  })

  it('Assigns initial balance', async () => {
    expect(await token.balanceOf(wallet)).to.equal(parseEther('1000'))
  })

  it('Transfer adds amount to destination account', async () => {
    await token.transfer(walletTo, 7)
    expect(await token.balanceOf(walletTo)).to.equal(7)
  })

  it('Transfer emits event', async () => {
    await expect(token.transfer(walletTo, 7)).to.emit(token, 'Transfer').withArgs(wallet, walletTo, 7)
  })

  it('Can not transfer above the amount', async () => {
    await expect(token.transfer(walletTo, parseEther('1007'))).to.be.reverted
  })

  it('Can not transfer from empty account', async () => {
    const tokenFromOtherWallet = token.connect(walletTo)
    await expect(tokenFromOtherWallet.transfer(wallet, 1)).to.be.reverted
  })

  it('Changes destination account token balance', async () => {
    // not supported
    // await expect(() => token.transfer(walletTo, 200)).to.changeTokenBalance(walletTo, 200)
  })

  it('Calls totalSupply on DaiToken contract', async () => {
    await token.totalSupply()
    // not supported
    // expect('totalSupply').to.be.calledOnContract(token)
  })

  it('Calls balanceOf with sender address on DaiToken contract', async () => {
    await token.balanceOf(wallet)
    // not supported
    // expect('balanceOf').to.be.calledOnContractWith(token, [wallet])
  })
})
