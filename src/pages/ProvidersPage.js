import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Flex, Text, Box } from 'rebass'
import { transparentize } from 'polished'

import LocalLoader from '../components/LocalLoader'
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapper } from '../components'
import { TYPE, ThemedBackground } from '../Theme'
import { RowBetween } from '../components/Row'
import { Divider } from '../components/'

import { useProviders } from '../contexts/Providers'
import { useAllTokens } from '../contexts/TokenData'

import { safeAccess } from '../utils'

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 100px 1fr 1fr;
  position: relative;

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
    grid-template-columns:1.5fr 1fr;


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
    grid-template-columns: 1.5fr 1fr;
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
  padding-bottom: 1rem;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const calculateTotalUSD = (providers, tokens) => {
  const totalUSD = {}

  Object.keys(providers)
    .forEach(provider => {
      const balances = safeAccess(providers, [provider, 'balances'])

      totalUSD[provider] = 0;

      Object.keys(balances)
        .forEach(asset => {
          const token = tokens.find(t => t.symbol === asset)
          totalUSD[provider] += Number(balances[asset].balance) * Number(token.priceUSD)
        })
    })

  return totalUSD
}

function ProvidersPage({ color = '#ff007a' }) {
  const providers = useProviders()
  const tokens = useAllTokens()
  const history = useHistory()

  const totalLiquidityPerProvider = useMemo(() => {
    if (!providers || !tokens) {
      return
    }

    return calculateTotalUSD(providers, tokens)
  }, [providers, tokens])

  if (!providers) {
    return <LocalLoader fill="true" />
  }

  const ListItem = ({ provider }) => <DashGrid style={{ height: '48px' }}>
    <DataText style={{
      fontWeight: 500,
      cursor: 'pointer'
    }} color={color} onClick={() => history.push(`/provider/${provider}`, {
      totalLiquidity: totalLiquidityPerProvider[provider]
    })}>
      {provider}
    </DataText>
    <DataText fontWeight="500">
      {'$' + totalLiquidityPerProvider[provider].toFixed(2)}
    </DataText>
  </DashGrid>


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
                color="textDim"
              >
                Provider
              </ClickableText>
            </Flex>
            <Flex alignItems="center">
              <ClickableText
                color="textDim">
                Total provided USD$
              </ClickableText>
            </Flex>
          </DashGrid>
          <Divider />
          <List p={0}>
            {Object.keys(providers).map((provider, idx) =>
              <ListItem key={provider} provider={provider} />
            )}
          </List>
        </Panel>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default ProvidersPage