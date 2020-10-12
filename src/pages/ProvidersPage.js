import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { Flex, Text, Box } from 'rebass'
import { transparentize } from 'polished'

import LocalLoader from '../components/LocalLoader'
import { PageWrapper, ContentWrapper } from '../components'
import { TYPE, ThemedBackground } from '../Theme'
import { RowBetween } from '../components/Row'
import Panel from '../components/Panel'
import { Divider } from '../components/'
import Link from '../components/Link'

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`


const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq price';
  padding: 0 1.125rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr;
    grid-template-areas: 'name symbol liq price change';
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => theme.text1};

  & > * {
    font-size: 1em;
  }

  @media screen and (max-width: 40em) {
    font-size: 0.85rem;
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

const MOCKED_LIST = [
  { id: 1, address: '0x321321321', balance: '432423432' },
  { id: 2, address: '434343', balance: '4324233433432' },
  { id: 3, address: '343324', balance: '3224' },
]

function ProvidersPage({ color = '#ff007a' }) {
  const [providersData, setProvidersData] = useState()

  useEffect(() => {

    (async () => {
       try {
         const response = await axios.get('https://jelly-jam.herokuapp.com/api/v1/info/get')

         setProvidersData(response.data)
       } catch (error) {
         console.log('Error getting liquidity providers', error)
      }
    })()
  }, [])

  if (!providersData) {
    return <LocalLoader fill="true" />
  }

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '48px' }}>
        <DataText area="provider" fontWeight="500">
          <Link color={color} external>
            {item.id}
          </Link>
        </DataText>
        <DataText area="address" fontWeight="500">
          {item.address}
        </DataText>
        <DataText area="balance" fontWeight="500">
          {item.balance}
        </DataText>
      </DashGrid>
    )
  }

  return (
    <PageWrapper>
      <ThemedBackground backgroundColor={transparentize(0.6, '#ff007a')} />
      <ContentWrapper>
        <RowBetween mt={40} mb={'1rem'}>
          <TYPE.main fontSize={'1.125rem'}>Providers</TYPE.main> <div />
        </RowBetween>

        <Panel>
          <DashGrid>
            <Flex alignItems="center">
              <ClickableText
                color="textDim">
                Provider
            </ClickableText>
            </Flex>

            <Flex alignItems="center">
              <ClickableText
                color="textDim">
                Pairs
            </ClickableText>
            </Flex>

            <Flex alignItems="center">
              <ClickableText
                color="textDim">
                Balances
              </ClickableText>
            </Flex>
          </DashGrid>
          <Divider />
          <List p={0}>
            {MOCKED_LIST.map(item =>
              <ListItem key={item.id} item={item} />
            )}
          </List>
        </Panel>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default ProvidersPage