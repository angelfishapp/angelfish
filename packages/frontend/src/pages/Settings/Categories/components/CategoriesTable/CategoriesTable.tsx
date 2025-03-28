import { DragableComponent } from '@/components/DragAndDrop/DragAndDrop.Dragable'
import DragIndicator from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import type { ColumnDef } from '@tanstack/react-table'

import { Emoji } from '@/components/Emoji'
import { Table } from '@/components/Table'
import type { IAccount } from '@angelfish/core'
import type { CategoriesTableProps } from './CategoriesTable.interface'

/**
 * Categories Table Component
 */
export function CategoriesTable({
  categories,
  pointerPosition = 40,
  onSelect,
  EmptyView,
}: CategoriesTableProps) {
  const columns: ColumnDef<IAccount>[] = [
    {
      header: '',
      id: 'dragable',
      cell: ({ row }) => (
        <DragableComponent data={row.original} key={row.id} id={row.id}>
          {({ listeners, attributes, setNodeRef }) => (
            <Button
              sx={{ padding: '1rem', cursor: 'grab' }}
              ref={setNodeRef}
              {...listeners}
              {...attributes}
              color="primary"
              variant="text"
            >
              <DragIndicator />
            </Button>
          )}
        </DragableComponent>
      ),
    },
    {
      accessorKey: 'name',
      cell: (cell) => (
        <Box display="flex" alignItems="center">
          <Box marginRight={0.5}>
            <Emoji size={24} emoji={cell.row.original.cat_icon ?? ''} />
          </Box>
          <Box whiteSpace="nowrap">{cell.getValue() as string}</Box>
        </Box>
      ),
      header: () => <span>Name</span>,
    },
    {
      accessorKey: 'cat_description',
      header: () => <span>Description</span>,
    },
    {
      accessorKey: 'cat_type',
      header: () => <span>Type</span>,
    },
  ]

  return (
    <Card sx={{ padding: '.5rem 0 0 0 ' }}>
      <div
        style={{
          left: pointerPosition,
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeft: '1rem solid transparent',
          borderRight: '1rem solid transparent',
          borderBottom: '1rem solid white',
          top: 0,
          transform: 'translate(-50%,-100%)',
        }}
      />
      <Table
        data={categories ?? []}
        columns={columns}
        initialState={{
          sorting: [{ id: 'name', desc: false }],
        }}
        enableSorting={true}
        enableSortingRemoval={false}
        EmptyView={EmptyView}
        displayFooter={false}
        onRowClick={(_, row) => onSelect(row.original)}
        variant="white"
      />
    </Card>
  )
}
