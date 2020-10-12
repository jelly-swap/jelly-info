import { useEffect, useState } from "react"

export const usePagination = (collection, itemsMax = 10) => {
  const [maxPage, setMaxPage] = useState(1)
  const [page, setPage] = useState(1);


  useEffect(() => {
    let extraPages = 1

    if (collection.length % itemsMax === 0) {
      extraPages = 0
    }

    if (collection.length === 0) {
      setMaxPage(1)
    } else {
      setMaxPage(Math.floor(collection.length / itemsMax) + extraPages)
    }
  }, [collection, itemsMax])

  return {
    page,
    setPage,
    maxPage
  }
}