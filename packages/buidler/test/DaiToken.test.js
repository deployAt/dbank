const { expect } = require('chai')
const parseEther = require('ethers').utils.parseEther

describe('DaiToken', () => {
  let DaiToken // contract factory
  let token, wallet, walletTo

  before(async () => {
    // Wallet
    const accounts = await ethers.getSigners()
    wallet = await accounts[0].getAddress()
    walletTo = await accounts[1].getAddress()
    DaiToken = await ethers.getContractFactory('DaiToken')
  })

  beforeEach(async () => {
    token = await DaiToken.deploy()
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
