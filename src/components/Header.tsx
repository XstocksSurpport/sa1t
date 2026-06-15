import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import DividendModal from './DividendModal'
import { useSa1tBalance } from '../hooks/useSa1tBalance'

function Logo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M12 7v10M7 12h10" />
    </svg>
  )
}

export default function Header() {
  const { login, logout, authenticated, user, ready } = usePrivy()
  const { wallets } = useWallets()
  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)

  const walletAddress = authenticated ? wallets[0]?.address : undefined
  const { display: sa1tDisplay, loading: sa1tLoading } = useSa1tBalance(walletAddress)

  const shortAddress = user?.wallet?.address
    ? `${user.wallet.address.slice(0, 6)}…${user.wallet.address.slice(-4)}`
    : ''

  return (
    <>
      <header className="header">
        <Link to="/" className="header-logo">
          <Logo />
        </Link>

        <nav className="header-nav">
          <Link to="/" className={location.pathname === '/' || location.pathname === '/discover' ? 'active' : ''}>
            Markets
          </Link>
          <Link to="/dividend" className={location.pathname === '/dividend' ? 'active' : ''}>
            Claim
          </Link>
          <a href="#">Portfolio</a>
          <a href="#">Launch</a>
          <a href="#">Docs</a>
          <a href="https://sa1t.fun" target="_blank" rel="noopener noreferrer">
            sa1t <span className="ext">↗</span>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            Art <span className="ext">↗</span>
          </a>
        </nav>

        <div className="header-right">
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="header-x"
            aria-label="X"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <button
            className="btn-dividend"
            onClick={() => setModalOpen(true)}
          >
            Claim
            {authenticated && !sa1tLoading && parseFloat(sa1tDisplay) > 0 && (
              <span className="btn-dividend-badge">{sa1tDisplay}</span>
            )}
          </button>

          {ready && (
            authenticated ? (
              <button className="btn-connect connected" onClick={logout}>
                {shortAddress}
              </button>
            ) : (
              <button className="btn-connect" onClick={login}>
                Connect
              </button>
            )
          )}
        </div>
      </header>

      <DividendModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
