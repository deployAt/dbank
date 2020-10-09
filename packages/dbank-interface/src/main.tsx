import React, { FC, useEffect } from 'react'
import { Web3ReactProvider, useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { ethers } from 'ethers'
import { SWRConfig } from 'swr'
import { ethFetcher } from 'ether-swr'

const injectedConnector = new InjectedConnector({})
const ABIs = [[]]
const fetcherABI = new Map(ABIs as any)

export const Main: FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MainRun />
    </Web3ReactProvider>
  )
}

const MainRun: FC = () => {
  const { library, activate } = useWeb3React()

  useEffect(() => {
    activate(injectedConnector)
  }, [])

  return (
    <SWRConfig value={{ fetcher: ethFetcher(library, fetcherABI as any) }}>
      <h1>DBank</h1>
    </SWRConfig>
  )
}

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider)
  // library.pollingInterval = 12000
  return library
}
