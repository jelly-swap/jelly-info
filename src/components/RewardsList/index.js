import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { formattedNum } from '../../utils'
import { useMedia } from 'react-use'

import LocalLoader from '../LocalLoader'
import { Flex, Text } from 'rebass'
import Link from '../Link'
import { Divider, EmptyCard } from '..'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { usePagination } from '../../hooks/usePagination'
import { Arrow, PageButtons, List, DataText } from '../common'

dayjs.extend(utc)

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'provider reward time';

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    grid-template-areas: 'provider liquidity reward time';

    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    max-width: 1320px;
    grid-template-columns: 1.2fr 1fr 1fr 1fr;
    grid-template-areas: 'provider liquidity reward time';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`
const SORT_FIELD = {
  LIQUIDITY: 'usd',
  REWARD: 'reward',
  DATE: 'date'
}

// @TODO rework into virtualized list
function RewardsList({ rewards, color, itemMax = 20 }) {
  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.DATE)
  const history = useHistory()

  const { page, setPage, maxPage } = usePagination(rewards)

  const filteredList =
    rewards &&
    rewards
      .sort((a, b) => {
        const sortA = sortedColumn === SORT_FIELD.DATE ? dayjs(a[sortedColumn]).valueOf() : a[sortedColumn]
        const sortB = sortedColumn === SORT_FIELD.DATE ? dayjs(b[sortedColumn]).valueOf() : b[sortedColumn]

        return parseFloat(sortA) > parseFloat(sortB) ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
      })
      .slice(itemMax * (page - 1), page * itemMax)

  const below780 = useMedia('(max-width: 780px)')

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '48px' }}>
        <DataText area="provider" fontWeight="500">
          <Link
            style={{ cursor: 'pointer' }}
            onClick={() => history.push(`/provider/${item.name}`)}
            color={color}
            external
          >
            {item.name}
          </Link>
        </DataText>

        {!below780 && (
          <DataText area="liquidity">
            {formattedNum(item.usd, true)} <FormattedName text={item.network} maxCharacters={5} margin={true} />
          </DataText>
        )}

        <DataText area="reward">
          {formattedNum(item.reward, true)}
          <FormattedName text={item.outputNetwork} maxCharacters={5} margin={true} />
        </DataText>

        <DataText area="time">{item.date}</DataText>
      </DashGrid>
    )
  }

  return (
    <>
      <DashGrid center={true} style={{ height: 'fit-content', padding: '0 0 1rem 0' }}>
        <Flex alignItems="center" justifyContent="flexStart">
          <TYPE.main area="provider">Provider</TYPE.main>
        </Flex>

        {!below780 && (
          <Flex alignItems="center">
            <ClickableText
              area="liquidity"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.LIQUIDITY)
                setSortDirection(sortedColumn !== SORT_FIELD.LIQUIDITY ? true : !sortDirection)
              }}
            >
              Liquidity
              {sortedColumn === SORT_FIELD.LIQUIDITY ? (sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        )}

        <>
          <Flex alignItems="center">
            <ClickableText
              area="reward"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.REWARD)
                setSortDirection(sortedColumn !== SORT_FIELD.REWARD ? true : !sortDirection)
              }}
            >
              Reward
              {sortedColumn === SORT_FIELD.REWARD ? (sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>

          <Flex alignItems="center">
            <ClickableText
              area="time"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.DATE)
                setSortDirection(sortedColumn !== SORT_FIELD.DATE ? true : !sortDirection)
              }}
            >
              Date {sortedColumn === SORT_FIELD.DATE ? (!sortDirection ? '↑' : '↓') : ''}
            </ClickableText>
          </Flex>
        </>
      </DashGrid>
      <Divider />
      <List p={0}>
        {!filteredList ? (
          <LocalLoader />
        ) : filteredList.length === 0 ? (
          <EmptyCard>No recent transactions found.</EmptyCard>
        ) : (
          filteredList.map((item, index) => {
            return (
              <div key={index}>
                <ListItem key={index} index={index + 1} item={item} />
                <Divider />
              </div>
            )
          })
        )}
      </List>
      <PageButtons>
        <div
          onClick={e => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={e => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </>
  )
}

export default RewardsList
