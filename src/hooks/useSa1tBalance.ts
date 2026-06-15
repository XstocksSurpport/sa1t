import { useEffect, useState, useCallback } from 'react'
import { createPublicClient, http, formatUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { SA1T_TOKEN_ADDRESS, erc20Abi } from '../data/sa1t'

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://eth.llamarpc.com'),
})

export function useSa1tBalance(walletAddress: string | undefined) {
  const [balance, setBalance] = useState<bigint>(0n)
  const [decimals, setDecimals] = useState(18)
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!walletAddress) {
      setBalance(0n)
      return
    }

    setLoading(true)
    try {
      const [raw, dec] = await Promise.all([
        publicClient.readContract({
          address: SA1T_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [walletAddress as `0x${string}`],
        }),
        publicClient.readContract({
          address: SA1T_TOKEN_ADDRESS,
          abi: erc20Abi,
          functionName: 'decimals',
        }),
      ])
      setBalance(raw)
      setDecimals(Number(dec))
    } catch {
      setBalance(0n)
    } finally {
      setLoading(false)
    }
  }, [walletAddress])

  useEffect(() => {
    refresh()
    const id = setInterval(refresh, 15000)
    return () => clearInterval(id)
  }, [refresh])

  const formatted = formatUnits(balance, decimals)
  const display = parseFloat(formatted) >= 1000
    ? parseFloat(formatted).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : parseFloat(formatted).toLocaleString(undefined, { maximumFractionDigits: 4 })

  return { balance, decimals, formatted, display, loading, refresh }
}
