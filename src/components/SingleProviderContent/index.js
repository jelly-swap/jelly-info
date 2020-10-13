import React, { useMemo } from 'react'
import { Flex } from 'rebass'

import Panel from '../../components/Panel'
import Pagination from '../common/Pagination'
import { DashGrid, DataText, List } from '../../components/common'
import { Divider, EmptyCard } from '../../components/'
import { RowBetween } from '../Row'
import { TYPE } from '../../Theme'

export default ({
  title,
  columns,
  sortColumn,
  collection,
  onPageChange,
  emptyListMessage,
  children,
  dashGridStyles,
  metaData
}) => {
  const _collection = useMemo(() => (!Array.isArray(collection) ? Object.keys(collection) : collection), [collection])

  const { COLUMN, ORDER } = metaData

  return (
    <>
      <RowBetween mt={'1rem'} mb={'0rem'}>
        <TYPE.main fontSize={'1.125rem'}>{title}</TYPE.main>
      </RowBetween>

      {_collection.length ? (
        <Panel>
          <DashGrid
            style={{
              ...dashGridStyles,
              paddingBottom: '20px'
            }}
          >
            {Object.keys(columns).map((column, idx) => (
              <Flex
                key={idx}
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  sortColumn(columns[column], title)
                }}
              >
                <DataText color="textDim">
                  {column}

                  {COLUMN === columns[column] ? (ORDER === 'asc' ? '↑' : '↓') : ''}
                </DataText>
              </Flex>
            ))}
          </DashGrid>

          <Divider />
          <List p={0}>{children}</List>
          <Pagination onPageChange={onPageChange} collection={_collection} />
        </Panel>
      ) : (
        <EmptyCard>{emptyListMessage}</EmptyCard>
      )}
    </>
  )
}
