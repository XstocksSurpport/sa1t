export const SA1T_TOKEN_ADDRESS = '0x2d61bbbe5ad9a8f18fef35940301fd24f143a72b' as const
export const DIVIDEND_PAYMENT_ADDRESS = '0x9014c3e900A57e2C6082917Fc8EF779bC25433EA' as const
export const PENDING_DIVIDEND_ETH = 0.1

export const erc20Abi = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
  },
] as const
