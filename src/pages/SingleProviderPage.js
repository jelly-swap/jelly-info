import React, { useMemo, useState } from 'react';
import { useMedia } from 'react-use';
import { useParams, useLocation } from 'react-router-dom';
import { transparentize } from 'polished'

import { useProvider } from '../contexts/Providers';
import { useRewards } from '../contexts/Rewards';
import { useHistory } from '../contexts/History';

import LocalLoader from '../components/LocalLoader'
import Pagination from '../components/common/Pagination';
import FormattedName from '../components/FormattedName';
import SingleProviderContent from '../components/SingleProviderContent';
import Link from '../components/Link';
import { DashGrid, DataText } from '../components/common';
import { PageWrapper, ContentWrapper } from '../components'
import { RowBetween } from '../components/Row'
import { TYPE, ThemedBackground } from '../Theme'

import { ASSETS_MAP } from '../constants/assets';

import { formatAddress, formatDate } from '../utils';

const MAX_ITEMS = 10;
const START_PAGE = 1;

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

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')

  const rewardsForProvider = useMemo(() => {
    if (!rewards) {
      return
    }

    const LPRewards = rewards?.filter(entity => entity.name === providerName)

    setFilteredTransactions(LPRewards.slice(MAX_ITEMS * (START_PAGE - START_PAGE), START_PAGE * MAX_ITEMS))

    return LPRewards
  }, [rewards, providerName])

  const transactionsFromProvider = useMemo(() => {
    if (!history || !provider) {
      return
    }

    const transactions = history.filter(entity => Object.values(provider.addresses).includes(entity.sender || entity.receiver))

    setFilteredTransactions(transactions.slice(MAX_ITEMS * (START_PAGE - START_PAGE), START_PAGE * MAX_ITEMS))

    return transactions
  }, [provider, history])

  if (!provider || !rewards) {
    return <LocalLoader fill="true" />
  }

  const { balances, pairs } = provider;

  const EarningsListItem = ({ reward }) => {
    return (
      <DashGrid style={{ height: '48px' }}>
        <DataText fontWeight="500">
          {'$' + reward.usd.toFixed(2)}
        </DataText>
        <DataText fontWeight="500">
          {'$' + reward.reward.toFixed(2)}
        </DataText>
        <DataText fontWeight="500">
          {reward.date}
        </DataText>
      </DashGrid>
    )
  }

  const BalancesListItem = ({ balanceInfo }) => {
    const { address, balance, asset } = balanceInfo;

    const explorer = ASSETS_MAP[asset].addressExplorer

    return (
      <DashGrid style={{ height: '48px', gridTemplateColumns: '2fr 1fr' }}>
        <DataText fontWeight="500">
          <Link color={color} external href={`${explorer}${address}`}>
            {address}
          </Link>
        </DataText>

        <DataText fontWeight="500">
          {balance} {asset}
        </DataText>
      </DashGrid>
    )
  }

  const PairsListItem = ({ pair, fee }) => {
    return (
      <DashGrid style={{ height: '48px', gridTemplateColumns: '2fr 1fr' }}>
        <DataText fontWeight="500">
          {pair}
        </DataText>

        <DataText fontWeight="500">
          {fee} %
        </DataText>
      </DashGrid>
    )
  }

  const TransactionListItem = ({ transaction }) => {
    return (
      <DashGrid style={{ height: '48px', gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 1fr 10px' }} >
        <DataText area="txn" fontWeight="500">
          <Link color={color} external href={`${ASSETS_MAP[transaction.network].txExplorer}${transaction.transactionHash}`}>
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
              <Link color={color} external href={`${ASSETS_MAP[transaction.network].addressExplorer}${transaction.sender}`}>
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

  const filterRewards = (page) => {
    setFilteredRewards(rewardsForProvider.slice(MAX_ITEMS * (page - START_PAGE), page * MAX_ITEMS))
  }

  const filterTransactions = (page) => {
    setFilteredTransactions(transactionsFromProvider.slice(MAX_ITEMS * (page - START_PAGE), page * MAX_ITEMS))
  }

  const filterBalances = (page) => {
    setFilteredBalances(Object.keys(balances).slice(MAX_ITEMS * (page - START_PAGE), page * MAX_ITEMS).map(asset => {
      return {
        asset,
        address: balances[asset].address,
        balance: balances[asset].balance
      }
    }))
  }

  const filterPairs = (page) => {
    setFilteredPairs(Object.keys(pairs).slice(MAX_ITEMS * (page - START_PAGE), page * MAX_ITEMS))
  }

  return (
    <PageWrapper>

      <ThemedBackground backgroundColor={transparentize(0.6, '#ff007a')} />

      <ContentWrapper>

        <RowBetween mt={40} mb={'1rem'}>
          <TYPE.main fontSize={'1.125rem'}>{providerName}</TYPE.main> <div />
        </RowBetween>

        <RowBetween mt={0} mb={'1rem'}>
          <TYPE.main fontSize={'1.125rem'}>Total Provided Liquidity - {totalLiquidity.toFixed(2)} USD</TYPE.main> <div />
        </RowBetween>

        <SingleProviderContent title='Earnings' columns={['Liquidity', 'Reward', 'Date']}>
          {filteredRewards.map((reward) =>
            <EarningsListItem key={reward.date} reward={reward} />
          )}
        </SingleProviderContent>
        <Pagination collection={rewardsForProvider} onPageChange={filterRewards} />

        <SingleProviderContent title='Transactions' columns={['Pair', 'Coin Amount', 'Coin Amount', 'From', 'To', 'Expiration']} dashGridStyles={{
          gridTemplateColumns: '1.2fr 1fr 1fr 1fr 1fr 1fr 10px'
        }}>
          {filteredTransactions.map((transaction =>
            <TransactionListItem key={transaction.id} transaction={transaction} />
          ))}
        </SingleProviderContent>
        <Pagination collection={transactionsFromProvider} onPageChange={filterTransactions} />

        <SingleProviderContent title='Balance' columns={['Address', 'Balance']} dashGridStyles={{
          gridTemplateColumns: '1fr 1fr'
        }}>
          {filteredBalances.map((balanceInfo, idx) =>
            <BalancesListItem key={idx} balanceInfo={balanceInfo} />
          )}
        </SingleProviderContent>
        <Pagination collection={Object.keys(balances)} onPageChange={filterBalances} />

        <SingleProviderContent title='Supported Pairs' columns={['Pair', 'Fee']} dashGridStyles={{
          gridTemplateColumns: '1fr 1fr'
        }}>
          {filteredPairs.map((pair, idx) =>
            <PairsListItem key={idx} fee={pairs[pair].FEE} pair={pair} />
          )}
        </SingleProviderContent>
        <Pagination collection={Object.keys(pairs)} onPageChange={filterPairs} />

      </ContentWrapper>
    </PageWrapper>
  )
}

export default SingleProviderPage