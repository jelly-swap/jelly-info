import React from 'react'
import styled from 'styled-components'
import { Flex } from 'rebass'
import { useMedia } from 'react-use'

import FormattedName from '../FormattedName'
import TokenLogo from '../TokenLogo'
import Link from '../Link'

import { formatAddress, formatDate } from '../../utils'

import { STATUS, STATUS_COLOR } from '../../constants'
import { ASSETS_MAP } from '../../constants/assets'

const TransactionWrapper = styled.div`
  .transaction-wrapper {
    position: absolute;
    width: 100%;
    height: 240px;
    border-radius: 10px;
    top: 3.5em;
    padding: 1em;
    padding-left: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    -webkit-animation: scale-up-ver-top 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;
    animation: scale-up-ver-top 0.4s cubic-bezier(0.39, 0.575, 0.565, 1) both;

    & > div,
    a {
      display: flex;

      align-items: center;
      transition: height 1s;
      width: 100%;
      height: 28px;

      .label {
        color: #ff007a;
        width: 150px;
        text-align: left;
      }
    }

    img {
      width: 20px;
      height: 20px;
    }

    a {
      color: #2172e5;

      span {
        color: #ff007a;
        text-transform: capitalize;
      }
    }

    @-webkit-keyframes scale-up-ver-top {
      0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
      }
      100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
      }
    }
    @keyframes scale-up-ver-top {
      0% {
        -webkit-transform: scaleY(0.4);
        transform: scaleY(0.4);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
      }
      100% {
        -webkit-transform: scaleY(1);
        transform: scaleY(1);
        -webkit-transform-origin: 100% 0%;
        transform-origin: 100% 0%;
      }
    }
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

export default ({ transaction }) => {
  const {
    transactionHash,
    network,
    outputNetwork,
    status,
    blockNumber,
    expiration,
    sender,
    outputAddress,
    completenessTransactionHash,
    inputAmountNum,
    outputAmountNum
  } = transaction

  const below780 = useMedia('(max-width: 780px)')

  return (
    <TransactionWrapper>
      <div className="transaction-wrapper">
        <div>
          <Link color={'#ff007a'} external href={`${ASSETS_MAP[network].txExplorer}${transactionHash}`}>
            {
              <>
                <span className="label">Transaction hash:</span>{' '}
                {below780 ? formatAddress(transactionHash) : transactionHash}
              </>
            }
          </Link>
        </div>
        <div>
          <span className="label">Status:</span>
          <DataText>
            <span style={{ textTransform: 'capitalize', color: STATUS_COLOR[STATUS[status]] }}>
              <strong>{STATUS[status].toLowerCase()}</strong>
            </span>
          </DataText>
        </div>
        <div>
          <span className="label">Sent:</span>
          <DataText>
            {inputAmountNum}
            <FormattedName text={<TokenLogo token={network} />} maxCharacters={5} margin={true} />
          </DataText>
        </div>
        <div>
          <span className="label">Received:</span>
          <DataText>
            {outputAmountNum}
            <FormattedName text={<TokenLogo token={outputNetwork} />} maxCharacters={5} margin={true} />
          </DataText>
        </div>
        <div>
          <Link color={'#ff007a'} external href={`${ASSETS_MAP[network].addressExplorer}${sender}`}>
            {
              <>
                <span className="label">From: </span> {below780 ? formatAddress(sender) : sender}
              </>
            }
          </Link>
        </div>
        <div>
          <Link color={'#ff007a'} external href={`${ASSETS_MAP[outputNetwork].addressExplorer}${outputAddress}`}>
            {
              <>
                <span className="label">To: </span> {below780 ? formatAddress(outputAddress) : outputAddress}
              </>
            }
          </Link>
        </div>
        <div>
          <span className="label">Block: </span>
          <DataText>{blockNumber}</DataText>
        </div>
        <div>
          <span className="label">Expiration: </span>
          <DataText>{formatDate(expiration)}</DataText>
        </div>

        {completenessTransactionHash && (
          <div>
            <Link color={'#ff007a'} external href={`${ASSETS_MAP[network].txExplorer}${completenessTransactionHash}`}>
              {
                <>
                  <span className="label">{STATUS[status].toLowerCase()}: </span>{' '}
                  {below780 ? formatAddress(completenessTransactionHash) : completenessTransactionHash}
                </>
              }
            </Link>
          </div>
        )}
      </div>
    </TransactionWrapper>
  )
}
