import React from 'react';
import { Flex } from 'rebass'

import Panel from '../../components/Panel'
import { RowBetween } from '../../components/Row'
import { DashGrid, DataText, List } from '../../components/common'
import { Divider } from '../../components/'
import { TYPE } from '../../Theme';


export default ({ title, columns, children, dashGridStyles }) => {
  return (
    <>
      <RowBetween mt={'1rem'} mb={'0rem'}>
        <TYPE.main fontSize={'1.125rem'}>{title}</TYPE.main> <div />
      </RowBetween>
      <Panel style={{ minHeight: '540px' }}>
        <DashGrid
          style={
            dashGridStyles
          }
        >
          {columns.map((column, idx) => <Flex key={idx} alignItems="center">
            <DataText
              color="textDim"
            >
              {column}
            </DataText>
          </Flex>)}
        </DashGrid>

        <Divider />
        <List p={0}>
          {children}
        </List>
      </Panel>
    </>
  )
}