import { Dispatch, useState } from "react"

import { ClassNameProp } from "types/base-props"
import { clamp } from "utils/clamp"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Button } from "./button"
import { Select } from "./select"

interface PageSizeSelectProps {
  pageSizes: number[]
  value: number
  onChange: Dispatch<number>
}
const PageSizeSelect = ({
  pageSizes,
  value,
  onChange,
}: PageSizeSelectProps) => (
  <Select.Root
    value={String(value)}
    placeholder="Size"
    onChange={value => onChange(Number(value))}
  >
    {pageSizes.map(size => (
      <Select.Option key={size} value={String(size)} />
    ))}
  </Select.Root>
)

interface PaginationButtonsProps {
  currentPage: number
  pages: number
  onPageChange: Dispatch<number>
}
const PaginationButtons = ({
  pages,
  currentPage,
  onPageChange,
}: PaginationButtonsProps) => {
  const buttons =
    pages < 5
      ? Array.from({ length: pages }, (_, index) => index)
      : Array.from({ length: 5 }, (_, index) => {
          const min = clamp(currentPage - 2, 0, pages - 5)
          return min + index
        })

  const ellipsis = (
    <span className="inline-grid w-8 place-content-center font-bold text-text-muted before:content-['...']" />
  )

  const firstPage = 0
  const lastPage = pages - 1

  const getButton = (pageIndex: number) => (
    <Button
      key={pageIndex}
      active={currentPage === pageIndex}
      onClick={() => onPageChange(pageIndex)}
      className="w-10"
    >
      {pageIndex + 1}
    </Button>
  )

  if (buttons.length <= 1) return <>{getButton(0)}</>

  return (
    <>
      {!buttons.includes(firstPage) && (
        <>
          {getButton(firstPage)}
          {ellipsis}
        </>
      )}
      {buttons.map(getButton)}
      {!buttons.includes(lastPage) && (
        <>
          {ellipsis}
          {getButton(lastPage)}
        </>
      )}
    </>
  )
}

const getPages = (items: number, size: number) => {
  let pages = Math.floor(items / size)
  if (items % size === 0) pages--
  return pages + 1
}

const getPageRange = (page: number, size: number) => {
  const start = page * size
  const end = start + size
  return { start, end }
}

export interface PageRange {
  start: number
  end: number
}
interface PaginationProps<
  TPageSize extends number,
  TInitialPageSize extends TPageSize,
> extends ClassNameProp {
  initialPageSize: TInitialPageSize
  pageSizes: [TPageSize, ...TPageSize[]]
  items: number
  onRangeChange: Dispatch<PageRange>
}

export const Pagination = <
  TPageSize extends number,
  TInitialPageSize extends TPageSize,
>({
  initialPageSize,
  pageSizes,
  items,
  onRangeChange,
  className,
}: PaginationProps<TPageSize, TInitialPageSize>) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [size, setSize] = useState<TPageSize>(initialPageSize)

  const pages = getPages(items, size)

  const changePage = (page: number) => {
    setCurrentPage(page)
    onRangeChange(getPageRange(page, size))
  }

  const changePageSize = (size: number) => {
    setCurrentPage(0)
    setSize(size as TPageSize)
    onRangeChange(getPageRange(0, size as TPageSize))
  }

  return (
    <div className={cn(hstack({ align: "center" }), className)}>
      <PaginationButtons
        pages={pages}
        currentPage={currentPage}
        onPageChange={changePage}
      />
      <div className="flex-1" />
      <span className="mr-2">Page size:</span>
      <PageSizeSelect
        pageSizes={pageSizes}
        value={size}
        onChange={changePageSize}
      />
    </div>
  )
}
