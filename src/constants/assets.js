export const ASSETS_MAP = {
  BTC: {
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    txExplorer: 'https://blockstream.info/tx/',
    addressExplorer: 'https://blockstream.info/address/'
  },

  ETH: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    txExplorer: 'https://etherscan.io/tx/',
    addressExplorer: 'https://etherscan.io/address/'
  },

  DAI: {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    txExplorer: 'https://etherscan.io/tx/',
    addressExplorer: 'https://etherscan.io/address/'
  },

  AE: {
    name: 'Aeternity',
    symbol: 'AE',
    decimals: 18,
    txExplorer: 'https://explorer.aepps.com/transactions/',
    addressExplorer: 'https://explorer.aeternity.io/account/transactions/',
    timestampMs: true // if timestamp is in milliseconds
  },

  WBTC: {
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    decimals: 8,
    txExplorer: 'https://etherscan.io/tx/',
    addressExplorer: 'https://etherscan.io/address/'
  },

  USDC: {
    name: 'USDC Stablecoin',
    symbol: 'USDC',
    decimals: 6,
    txExplorer: 'https://etherscan.io/tx/',
    addressExplorer: 'https://etherscan.io/address/'
  },

  ONE: {
    name: 'Harmony One',
    symbol: 'ONE',
    decimals: 18,
    txExplorer: 'https://explorer.harmony.one/#/tx/',
    addressExplorer: 'https://explorer.harmony.one/#/address/'
  },

  MATIC: {
    name: 'Matic Network',
    symbol: 'MATIC',
    decimals: 18,
    txExplorer: 'https://explorer.matic.network/tx/',
    addressExplorer: 'https://explorer.matic.network/address/'
  },

  AVAX: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
    txExplorer: 'https://cchain.explorer.avax.network/tx/',
    addressExplorer: 'https://cchain.explorer.avax.network/address/'
  },

  BNB: {
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
    txExplorer: 'https://bscscan.com/tx/',
    addressExplorer: 'https://bscscan.com/address/'
  },

  ALGO: {
    name: 'Algorand',
    symbol: 'ALGO',
    decimals: 6,
    txExplorer: 'https://algoexplorer.io/tx/',
    addressExplorer: 'https://algoexplorer.io/address/'
  },

  TBTC: {
    name: 'tBTC',
    symbol: 'TBTC',
    decimals: 18,
    txExplorer: 'https://etherscan.io/tx/',
    addressExplorer: 'https://etherscan.io/address/'
  }
}

export const ASSETS = Object.values(ASSETS_MAP)
