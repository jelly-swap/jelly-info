import React, { useEffect } from 'react';

import { Arrow, PageButtons } from '../';
import { TYPE } from '../../../Theme';

import { usePagination } from '../../../hooks/usePagination';

export default ({ collection, onPageChange }) => {

  const { page, setPage, maxPage } = usePagination(collection);

  useEffect(() => {
    onPageChange(page);
  }, [page, onPageChange])

  return (
    <PageButtons >
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
  )
}