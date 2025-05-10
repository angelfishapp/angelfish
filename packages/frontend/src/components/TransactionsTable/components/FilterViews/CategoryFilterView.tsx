import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'

import { BankIcon } from '@/components/BankIcon'
import { Emoji } from '@/components/Emoji'
import type { IAccount } from '@angelfish/core'
import type { FilterViewProps } from './FilterView.interface'

/**
 * Helper Functions
 */

function getTitle(account: IAccount | undefined): string {
  let title = 'Unclassified'
  if (account) {
    title =
      account.class == 'CATEGORY'
        ? `${account.categoryGroup?.name} > ${account.name}`
        : `${account.institution?.name} > ${account.name}`
  }

  return title
}

/**
 * Main Filter Component for Category Column
 */
export default function CategoryFilterView({ table, column, onClose }: FilterViewProps) {
  const filterValue = column.getFilterValue() as number[]
  const filteredRows = table.getFilteredRowModel().rows

  // Component State
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(filterValue ?? [])

  // Calculate list of Categories for filtering
  // using the filtered Rows
  const categories = React.useMemo(() => {
    // Get Unique values and Sort alphabetically
    const options = new Set<IAccount | undefined>()
    filteredRows.forEach((row) => options.add(row.original.category))
    const uniqueCategories = [...options.values()].sort((a?: IAccount, b?: IAccount) =>
      getTitle(a).localeCompare(getTitle(b)),
    )
    return uniqueCategories
  }, [filteredRows])

  // Update Table Filter
  React.useEffect(() => {
    column.setFilterValue(selectedCategories)
  }, [column, selectedCategories])

  // React-Virtual State
  const listContainerRef = React.useRef<HTMLDivElement>(null)

  // React-Virtual Configuration
  const virtualizer = useVirtualizer({
    count: categories.length,
    getScrollElement: () => listContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  /**
   * Render List of Virtualised Categories
   */
  const RenderCategory = (account: IAccount) => {
    if (account) {
      return (
        <React.Fragment>
          <ListItemIcon
            sx={{
              minWidth: 0,
              marginRight: (theme) => theme.spacing(1),
            }}
          >
            <Checkbox
              edge="start"
              color="primary"
              checked={selectedCategories.includes(account.id)}
              onClick={() => {
                const selected = structuredClone(selectedCategories)
                const pos = selected.indexOf(account.id)
                if (pos > -1) {
                  // Remove item from selecton
                  selected.splice(pos, 1)
                } else {
                  selected.push(account.id)
                }
                setSelectedCategories(selected)
              }}
            />
          </ListItemIcon>
          <ListItemText>
            {account.class == 'CATEGORY' ? (
              <Grid container alignItems="flex-start" wrap="nowrap" spacing={2}>
                <Grid>
                  <Emoji emoji={account.cat_icon ?? ''} size={24} />
                </Grid>
                <Grid>
                  <Typography textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                    {account.categoryGroup?.name}: {account.name}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Grid container alignItems="flex-start" wrap="nowrap" spacing={2}>
                <Grid>
                  <BankIcon logo={account.institution?.logo} size={24} />
                </Grid>
                <Grid>
                  <Typography textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
                    {account.institution?.name}: {account.name}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </ListItemText>
        </React.Fragment>
      )
    }
    // Handle Unclassified (null) Transactions
    return (
      <React.Fragment>
        <ListItemIcon
          sx={{
            minWidth: 0,
            marginRight: (theme) => theme.spacing(1),
          }}
        >
          <Checkbox
            edge="start"
            color="primary"
            checked={selectedCategories.includes(0)}
            onClick={() => {
              // Use 0 for ID of Unclassified
              const selected = structuredClone(selectedCategories)
              const pos = selected.indexOf(0)
              if (pos > -1) {
                // Remove item from selecton
                selected.splice(pos, 1)
              } else {
                selected.push(0)
              }
              setSelectedCategories(selected)
            }}
          />
        </ListItemIcon>
        <ListItemText>Unclassified</ListItemText>
      </React.Fragment>
    )
  }

  // Render
  return (
    <Box width={500}>
      <Box ref={listContainerRef} marginBottom={1} height={300} overflow="auto">
        <List sx={{ height: virtualizer.getTotalSize(), width: '100%' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const account = categories[virtualItem.index] as IAccount

            return (
              <ListItem
                sx={{
                  height: 40,
                }}
                key={virtualItem.key}
                title={getTitle(account)}
                style={{
                  position: 'absolute',
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                {RenderCategory(account)}
              </ListItem>
            )
          })}
        </List>
      </Box>
      <Divider />
      <Box padding={1}>
        <Button
          onClick={() => {
            column.setFilterValue(undefined)
            onClose()
          }}
          fullWidth
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}
