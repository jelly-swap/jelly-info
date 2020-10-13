import React, { useEffect, useMemo, useRef, useState } from 'react'
import dayjs from 'dayjs'
import { useMedia } from 'react-use'
import { useParams, useLocation } from 'react-router-dom'
import { transparentize } from 'polished'

import { useProvider } from '../contexts/Providers'
import { useRewards } from '../contexts/Rewards'
import { useHistory } from '../contexts/History'

import LocalLoader from '../components/LocalLoader'
import FormattedName from '../components/FormattedName'
import SingleProviderContent from '../components/SingleProviderContent'
import Link from '../components/Link'
import { DashGrid, DataText } from '../components/common'
import { PageWrapper, ContentWrapper } from '../components'
import { RowBetween } from '../components/Row'
import { TYPE, ThemedBackground } from '../Theme'

import { ASSETS_MAP } from '../constants/assets'

import { formatAddress, formatDate } from '../utils'

const MAX_ITEMS = 10
const START_PAGE = 1

const TABLE_CONFIG = {
  REWARDS: {
    TITLE: 'Rewards',
    EMPTY_LIST_MSG: 'No rewards were found',
    GRID_TEMPLATE: '1fr 1fr 1fr',
    PAGE: START_PAGE,
    ORDER: 'desc',
    COLUMN: 'date',
    COLUMNS: {
      Liquidity: 'usd',
      Reward: 'reward',
      Date: 'date'
    }
  },
  TRANSACTIONS(currentResolution) {
    const DEFAULT_CONFIG = {
      TITLE: 'Transactions',
      EMPTY_LIST_MSG: 'No transactions were found',
      PAGE: START_PAGE,
      ORDER: 'desc',
      COLUMN: 'expiration'
    }

    if (currentResolution?.below780) {
      return {
        ...DEFAULT_CONFIG,
        GRID_TEMPLATE: '1.2fr 1fr 1fr',
        COLUMNS: {
          Pair: undefined,
          Received: 'inputAmount',
          Expiration: 'expiration'
        }
      }
    }

    if (currentResolution?.below1080) {
      return {
        ...DEFAULT_CONFIG,
        GRID_TEMPLATE: '1.2fr 1fr 1fr 1fr',
        COLUMNS: {
          Pair: undefined,
          Received: 'inputAmount',
          Sended: 'outputAmount',
          Expiration: 'expiration'
        }
      }
    }

    return {
      ...DEFAULT_CONFIG,
      GRID_TEMPLATE: '1.2fr 1fr 1fr 1fr 1fr 1fr 10px',
      COLUMNS: {
        Pair: undefined,
        Received: 'inputAmount',
        Sended: 'outputAmount',
        From: 'sender',
        To: 'receiver',
        Expiration: 'expiration'
      }
    }
  },
  BALANCES: {
    TITLE: 'Balances',
    EMPTY_LIST_MSG: 'No balances were found',
    PAGE: START_PAGE,
    ORDER: 'desc',
    GRID_TEMPLATE: '2fr 1fr',
    COLUMN: 'balance',
    COLUMNS: {
      Address: 'address',
      Balance: 'balance'
    }
  },
  PAIRS: {
    TITLE: 'Pairs',
    EMPTY_LIST_MSG: 'No pairs were found',
    PAGE: START_PAGE,
    ORDER: 'desc',
    GRID_TEMPLATE: '1fr 1fr 1fr',
    COLUMN: 'price',
    COLUMNS: {
      Pair: 'pair',
      Fee: 'fee',
      Price: 'price'
    }
  }
}

function SingleProviderPage({ color = '#ff007a' }) {
  const { totalLiquidity } = useLocation().state
  const providerName = useParams().provider
  const provider = useProvider(providerName)
  const rewards = useRewards()
  const history = useHistory()

  const [filteredRewards, setFilteredRewards] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [filteredBalances, setFilteredBalances] = useState([])
  const [filteredPairs, setFilteredPairs] = useState([])

  const balancesArrRef = useRef([])
  const pairsArrRef = useRef([])

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')

  useEffect(() => {
    if (!provider) {
      return
    }

    const { balances, pairs } = provider

    balancesArrRef.current = Object.keys(balances).map(asset => {
      const { address, balance } = balances[asset]
      return {
        asset,
        address,
        balance
      }
    })

    pairsArrRef.current = Object.keys(pairs).map(asset => {
      const { FEE, PRICE } = pairs[asset]

      return {
        asset,
        fee: (Number(FEE) * 100).toFixed(2),
        price: PRICE || 0
      }
    })
  }, [provider])

  const rewardsForProvider = useMemo(() => {
    if (!rewards) {
      return
    }

    const LPRewards = rewards.filter(entity => entity.name === providerName)

    return LPRewards
  }, [rewards, providerName])

  const transactionsFromProvider = useMemo(() => {
    if (!history || !provider) {
      return
    }

    const transactions = history.filter(entity =>
      Object.values(provider.addresses)
        .map(addr => addr.toLowerCase())
        .includes(entity.sender.toLowerCase() || entity.receiver.toLowerCase())
    )

    return transactions
  }, [provider, history])

  if (!provider || !rewards) {
    return <LocalLoader fill="true" />
  }

  const filterRewards = page => {
    const { REWARDS } = TABLE_CONFIG

    TABLE_CONFIG.REWARDS.PAGE = page

    setFilteredRewards(sortCollection(rewardsForProvider, REWARDS.COLUMN, REWARDS.TITLE, page))
  }

  const filterTransactions = page => {
    const { TRANSACTIONS } = TABLE_CONFIG

    TRANSACTIONS().PAGE = page

    setFilteredTransactions(sortCollection(transactionsFromProvider, TRANSACTIONS().COLUMN, TRANSACTIONS().TITLE, page))
  }

  const filterBalances = page => {
    const { BALANCES } = TABLE_CONFIG

    BALANCES.PAGE = page

    setFilteredBalances(sortCollection(balancesArrRef.current, BALANCES.COLUMN, BALANCES.TITLE, page))
  }

  const filterPairs = page => {
    const { PAIRS } = TABLE_CONFIG

    PAIRS.PAGE = page

    setFilteredPairs(sortCollection(pairsArrRef.current, PAIRS.COLUMN, PAIRS.TITLE, page))
  }

  const sortColumn = (column, table) => {
    if (!column) {
      return
    }

    const tableKey = table.toUpperCase()

    TABLE_CONFIG[tableKey].ORDER = TABLE_CONFIG[tableKey].ORDER === 'asc' ? 'desc' : 'asc'

    TABLE_CONFIG[tableKey].COLUMN = column

    switch (table) {
      case TABLE_CONFIG.REWARDS.TITLE:
        const rewardsPage = TABLE_CONFIG.REWARDS.PAGE

        setFilteredRewards(sortCollection(rewardsForProvider, column, table, rewardsPage))
        return
      case TABLE_CONFIG.TRANSACTIONS().TITLE:
        const transactionsPage = TABLE_CONFIG.TRANSACTIONS().PAGE

        setFilteredTransactions(sortCollection(transactionsFromProvider, column, table, transactionsPage))
        return
      case TABLE_CONFIG.BALANCES.TITLE:
        const balancesPage = TABLE_CONFIG.TRANSACTIONS().PAGE

        setFilteredBalances(sortCollection(balancesArrRef.current, column, table, balancesPage))
        return
      case TABLE_CONFIG.PAIRS.TITLE:
        const pairsPage = TABLE_CONFIG.TRANSACTIONS().PAGE

        setFilteredPairs(sortCollection(pairsArrRef.current, column, table, pairsPage))
        return
      default:
        return
    }
  }

  const sortCollection = (collection, column, table, page) => {
    const sortOrder = TABLE_CONFIG[table.toUpperCase()].ORDER

    return collection
      .sort((a, b) => {
        const aSortValue = column === 'date' || column === 'expiration' ? dayjs(a[column]).valueOf() : a[column]
        const bSortValue = column === 'date' || column === 'expiration' ? dayjs(b[column]).valueOf() : b[column]

        return sortOrder === 'asc' ? aSortValue - bSortValue : bSortValue - aSortValue
      })
      .slice(MAX_ITEMS * (page - START_PAGE), page * MAX_ITEMS)
  }

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.6, '#ff007a')} />

      <ContentWrapper>
        <RowBetween mt={40} mb={'1rem'}>
          <TYPE.main fontSize={'1.125rem'}>{providerName}</TYPE.main> <div />
        </RowBetween>

        <RowBetween mt={0} mb={'1rem'}>
          <TYPE.main fontSize={'1.125rem'}>Total Provided Liquidity - {totalLiquidity.toFixed(2)} USD</TYPE.main>{' '}
          <div />
        </RowBetween>

        <SingleProviderContent
          title={TABLE_CONFIG.REWARDS.TITLE}
          emptyListMessage={TABLE_CONFIG.REWARDS.EMPTY_LIST_MSG}
          columns={TABLE_CONFIG.REWARDS.COLUMNS}
          collection={rewardsForProvider}
          metaData={TABLE_CONFIG.REWARDS}
          sortColumn={sortColumn}
          onPageChange={filterRewards}
        >
          {filteredRewards.map(reward => (
            <RewardsListItem key={reward.date} reward={reward} color={color} />
          ))}
        </SingleProviderContent>

        <SingleProviderContent
          title={TABLE_CONFIG.TRANSACTIONS().TITLE}
          emptyListMessage={TABLE_CONFIG.TRANSACTIONS().EMPTY_LIST_MSG}
          columns={
            TABLE_CONFIG.TRANSACTIONS({
              below780,
              below1080
            }).COLUMNS
          }
          collection={transactionsFromProvider}
          dashGridStyles={{
            gridTemplateColumns: TABLE_CONFIG.TRANSACTIONS({
              below780,
              below1080
            }).GRID_TEMPLATE
          }}
          metaData={TABLE_CONFIG.TRANSACTIONS()}
          onPageChange={filterTransactions}
          sortColumn={sortColumn}
        >
          {filteredTransactions.map(transaction => (
            <TransactionListItem
              key={transaction.id}
              transaction={transaction}
              color={color}
              below780={below780}
              below1080={below1080}
            />
          ))}
        </SingleProviderContent>

        <SingleProviderContent
          title={TABLE_CONFIG.BALANCES.TITLE}
          emptyListMessage={TABLE_CONFIG.BALANCES.EMPTY_LIST_MSG}
          columns={TABLE_CONFIG.BALANCES.COLUMNS}
          collection={balancesArrRef.current}
          dashGridStyles={{
            gridTemplateColumns: TABLE_CONFIG.BALANCES.GRID_TEMPLATE
          }}
          metaData={TABLE_CONFIG.BALANCES}
          sortColumn={sortColumn}
          onPageChange={filterBalances}
        >
          {filteredBalances.map((balanceInfo, idx) => (
            <BalancesListItem key={idx} balanceInfo={balanceInfo} color={color} />
          ))}
        </SingleProviderContent>

        <SingleProviderContent
          title={TABLE_CONFIG.PAIRS.TITLE}
          emptyListMessage={TABLE_CONFIG.PAIRS.EMPTY_LIST_MSG}
          columns={TABLE_CONFIG.PAIRS.COLUMNS}
          collection={pairsArrRef.current}
          dashGridStyles={{
            gridTemplateColumns: TABLE_CONFIG.PAIRS.GRID_TEMPLATE
          }}
          metaData={TABLE_CONFIG.PAIRS}
          sortColumn={sortColumn}
          onPageChange={filterPairs}
        >
          {filteredPairs.map((pair, idx) => (
            <PairsListItem key={idx} pair={pair} color={color} />
          ))}
        </SingleProviderContent>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default SingleProviderPage

const RewardsListItem = ({ reward, color }) => {
  return (
    <DashGrid style={{ height: '48px' }}>
      <DataText fontWeight="500">{'$' + reward.usd.toFixed(2)}</DataText>
      <DataText fontWeight="500">{'$' + reward.reward.toFixed(2)}</DataText>
      <DataText fontWeight="500">{reward.date}</DataText>
    </DashGrid>
  )
}

const BalancesListItem = ({ balanceInfo, color }) => {
  const { address, balance, asset } = balanceInfo

  const explorer = ASSETS_MAP[asset].addressExplorer

  return (
    <DashGrid style={{ height: '48px', gridTemplateColumns: TABLE_CONFIG.BALANCES.GRID_TEMPLATE }}>
      <DataText fontWeight="500">
        <Link color={color} external href={`${explorer}${address}`}>
          {address}
        </Link>
      </DataText>

      <DataText fontWeight="500">
        {Number(balance).toFixed(5)} {asset}
      </DataText>
    </DashGrid>
  )
}

const PairsListItem = ({ pair, color }) => {
  return (
    <DashGrid style={{ height: '48px', gridTemplateColumns: TABLE_CONFIG.PAIRS.GRID_TEMPLATE }}>
      <DataText fontWeight="500">{pair.asset}</DataText>

      <DataText fontWeight="500">{pair.fee} %</DataText>

      <DataText fontWeight="500">{pair.price}</DataText>
    </DashGrid>
  )
}

const TransactionListItem = ({ transaction, color, below780, below1080 }) => {
  return (
    <DashGrid
      style={{
        height: '48px',
        gridTemplateColumns: TABLE_CONFIG.TRANSACTIONS({
          below780,
          below1080
        }).GRID_TEMPLATE
      }}
    >
      <DataText area="txn" fontWeight="500">
        <Link
          color={color}
          external
          href={`${ASSETS_MAP[transaction.network].txExplorer}${transaction.transactionHash}`}
        >
          {`Swap ${transaction.network} for ${transaction.outputNetwork}`}
        </Link>
      </DataText>

      <DataText area="amountToken">
        {transaction.inputAmountNum} <FormattedName text={transaction.network} maxCharacters={5} margin={true} />
      </DataText>

      {!below780 && (
        <DataText area="amountOther">
          {transaction.outputAmountNum}
          <FormattedName text={transaction.outputNetwork} maxCharacters={5} margin={true} />
        </DataText>
      )}

      {!below1080 && (
        <>
          <DataText area="from">
            <Link
              color={color}
              external
              href={`${ASSETS_MAP[transaction.network].addressExplorer}${transaction.sender}`}
            >
              {transaction.sender && formatAddress(transaction.sender)}
            </Link>
          </DataText>
        </>
      )}

      {!below1080 && (
        <DataText area="to">
          <Link
            color={color}
            external
            href={`${ASSETS_MAP[transaction.outputNetwork].addressExplorer}${transaction.outputAddress}`}
          >
            {transaction.outputAddress && formatAddress(transaction.outputAddress)}
          </Link>
        </DataText>
      )}

      <DataText area="time">{formatDate(transaction.expiration)}</DataText>
    </DashGrid>
  )
}
