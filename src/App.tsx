import { useEffect } from 'react'
import { PrivyProvider, usePrivy, useWallets } from '@privy-io/react-auth'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import MarketsPage from './components/MarketsPage'
import TokenPage from './components/TokenPage'
import './index.css'

const PRIVY_APP_ID = 'cmq8xavwq00dw0bjo5cj6slax'

function ChainSwitcher() {
  const { authenticated, ready } = usePrivy()
  const { wallets } = useWallets()

  useEffect(() => {
    if (!ready || !authenticated || wallets.length === 0) return

    const wallet = wallets[0]
    wallet.switchChain(1).catch(() => {})
  }, [ready, authenticated, wallets])

  return null
}

function AppContent() {
  return (
    <>
      <ChainSwitcher />
      <Header />
      <Routes>
        <Route path="/" element={<MarketsPage />} />
        <Route path="/discover" element={<MarketsPage />} />
        <Route path="/t/:address" element={<TokenPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        loginMethods: ['wallet'],
        appearance: {
          theme: 'dark',
          accentColor: '#00ffc8',
        },
        embeddedWallets: {
          createOnLogin: 'off',
        },
        defaultChain: {
          id: 1,
          name: 'Ethereum',
          nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
          rpcUrls: { default: { http: ['https://eth.llamarpc.com'] } },
        },
        supportedChains: [
          {
            id: 1,
            name: 'Ethereum',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: { default: { http: ['https://eth.llamarpc.com'] } },
          },
        ],
      }}
    >
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </PrivyProvider>
  )
}
