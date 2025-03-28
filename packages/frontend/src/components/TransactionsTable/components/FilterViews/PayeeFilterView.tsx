import {
  Box,
  Button,
  Checkbox,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'

import type { FilterViewProps } from './FilterView.interface'

/**
 * Main Filter Component for Payee Column
 */

export default function PayeeFilterView({ column, onClose }: FilterViewProps) {
  const filterValue = column.getFilterValue() as string[]
  const filteredValues = column.getFacetedUniqueValues()

  // Component State
  const [selectedPayees, setSelectedPayees] = React.useState<string[]>(
    filterValue ? filterValue : [],
  )

  // Calculate list of Payees for filtering
  // using the filtered Rows
  const payees = React.useMemo(() => {
    return Array.from(filteredValues.keys())
      .filter((value) => value !== undefined)
      .sort()
  }, [filteredValues])

  // Update Table Filter
  React.useEffect(() => {
    column.setFilterValue(selectedPayees)
  }, [selectedPayees, column])

  // React-Virtual State
  const listContainerRef = React.useRef<HTMLDivElement>(null)

  // React-Virtual Configuration
  const virtualizer = useVirtualizer({
    count: payees.length,
    getScrollElement: () => listContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  // Render
  return (
    <Box width={400}>
      <Box ref={listContainerRef} marginBottom={1} height={300} overflow="auto">
        <List sx={{ height: virtualizer.getTotalSize(), width: '100%' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <ListItem
              key={virtualItem.key}
              title={payees[virtualItem.index] as string}
              style={{
                position: 'absolute',
                transform: `translateY(${virtualItem.start}px)`,
                height: 40,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  marginRight: (theme) => theme.spacing(1),
                }}
              >
                <Checkbox
                  edge="start"
                  color="primary"
                  checked={selectedPayees.includes(payees[virtualItem.index] as string)}
                  onClick={() => {
                    const selected = [...selectedPayees]
                    const pos = selected.indexOf(payees[virtualItem.index] as string)
                    if (pos > -1) {
                      // Remove item from selecton
                      selected.splice(pos, 1)
                    } else {
                      selected.push(payees[virtualItem.index] as string)
                    }
                    setSelectedPayees(selected)
                  }}
                />
              </ListItemIcon>
              <ListItemText
                slotProps={{
                  primary: {
                    noWrap: true,
                    textOverflow: 'ellipsis',
                  },
                }}
              >
                {payees[virtualItem.index]}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box padding={1}>
        <Button
          onClick={() => {
            column.setFilterValue(undefined)
            onClose()
          }}
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}
