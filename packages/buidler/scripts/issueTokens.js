async function main() {
  const farm = await ethers.getContract('Farm')
  console.log('farm:', farm.address)

  await farm.issueTokens()
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
