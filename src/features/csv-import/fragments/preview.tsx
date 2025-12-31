import { PropsWithChildren, useState } from "react"

import { msg, t } from "@lingui/core/macro"
import { Trans } from "@lingui/react/macro"
import { Dices } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { createColumnHelper, Table } from "components/ui/table"
import { TimeEntry } from "data/time-entries"
import { CategoryName } from "features/components/category-name"
import { cn } from "utils/cn"

import { Container } from "./container"

const Cell = ({ children }: PropsWithChildren<{ empty?: boolean }>) => (
  <div
    className={cn(
      "inline-flex items-center p-2 text-nowrap",
      !children && "text-text-muted"
    )}
  >
    {children || t`Missing`}
  </div>
)

interface TableConfig {
  rowData: TimeEntry
  rowMeta?: {}
}

const helper = createColumnHelper<TableConfig>()
const columns = [
  helper.column({
    name: msg`Date`,
    render: ({ rowData }) => <Cell>{rowData.date}</Cell>,
  }),
  helper.column({
    name: msg`Description`,
    render: ({ rowData }) => <Cell>{rowData.description}</Cell>,
  }),
  helper.column({
    name: msg`Category`,
    render: ({ rowData, ...meta }) => (
      <Cell>
        <CategoryName categoryId={rowData.categoryId} {...meta} />
      </Cell>
    ),
  }),
  helper.column({
    name: msg`Time Start`,
    render: ({ rowData }) => <Cell>{rowData.start}</Cell>,
  }),
  helper.column({
    name: msg`Time End`,
    render: ({ rowData }) => <Cell>{rowData.end}</Cell>,
  }),
]

const getRandomSample = <T,>(data: T[], amount: number): T[] => {
  if (data.length <= amount) return data

  const getRandomIndex = () => Math.floor(Math.random() * data.length)
  const indeces = new Set<number>()
  while (indeces.size < amount) {
    indeces.add(getRandomIndex())
  }
  return [...indeces].map(index => data[index]!)
}

export const Preview = ({ data }: { data: TimeEntry[] }) => {
  // eslint-disable-next-line react/hook-use-state
  const setRerender = useState(0)[1]

  return (
    <Container
      title={
        <>
          <Trans>Preview Sample</Trans>
          <IconButton
            title={t`Take another sample`}
            size="sm"
            icon={Dices}
            onClick={() => setRerender(count => count + 1)}
            className="ml-2"
          />
        </>
      }
    >
      <div className="max-h-80 overflow-auto rounded-md bg-background">
        <Table<TableConfig>
          rowData={getRandomSample(data, 5).sort((a, b) =>
            b.date.localeCompare(a.date)
          )}
          columns={columns}
          gridCols="grid-cols-[auto_auto_auto_auto_auto]"
        />
      </div>
    </Container>
  )
}
