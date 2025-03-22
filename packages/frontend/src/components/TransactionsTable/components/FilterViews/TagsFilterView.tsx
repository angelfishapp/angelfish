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
import type { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { useVirtualizer } from '@tanstack/react-virtual'
import React from 'react'

import type { ITag } from '@angelfish/core'
import type { FilterViewProps } from './FilterView.interface'

/**
 * TagsFilterView Component Styles
 */
const useStyles = makeStyles<Theme>((theme: Theme) => ({
  virtualizedListItem: {
    height: 40,
  },
  listCheckBox: {
    minWidth: 0,
    marginRight: theme.spacing(1),
  },
}))

/**
 * Main Filter Component for Tags Column
 */
export default function TagsFilterView({ table, column, onClose }: FilterViewProps) {
  const classes = useStyles()
  const filterValue = column.getFilterValue() as number[]
  const filteredRows = table.getFilteredRowModel().rows

  // Component State
  const [selectedTags, setSelectedTags] = React.useState<number[]>(filterValue ? filterValue : [])

  // Calculate list of Tags for filtering
  // using the filtered Rows
  const tags = React.useMemo(() => {
    // Get Unique values and Sort alphabetically
    const options = new Set<ITag>()
    filteredRows.forEach((row) => {
      if (Array.isArray(row.original.tags)) {
        row.original.tags.forEach((tag) => options.add(tag))
      }
    })
    const uniqueTags = [...options.values()].sort((a: ITag, b: ITag) =>
      a.name.localeCompare(b.name),
    )
    return uniqueTags
  }, [filteredRows])

  // Update Table Filter
  React.useEffect(() => {
    column.setFilterValue(selectedTags)
  }, [selectedTags, column])

  // React-Virtual State
  const listContainerRef = React.useRef<HTMLDivElement>(null)

  // React-Virtual Configuration
  const virtualizer = useVirtualizer({
    count: tags.length,
    getScrollElement: () => listContainerRef.current,
    estimateSize: () => 40,
    overscan: 10,
  })

  // Render
  return (
    <Box width={250}>
      <Box ref={listContainerRef} marginBottom={1} height={300} overflow="auto">
        <List sx={{ height: virtualizer.getTotalSize(), width: '100%' }}>
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <ListItem
              className={classes.virtualizedListItem}
              key={virtualItem.key}
              title={tags[virtualItem.index].name}
              style={{
                position: 'absolute',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <ListItemIcon className={classes.listCheckBox}>
                <Checkbox
                  edge="start"
                  color="primary"
                  checked={selectedTags.includes(tags[virtualItem.index].id)}
                  onClick={() => {
                    const selected = structuredClone(selectedTags)
                    const pos = selected.indexOf(tags[virtualItem.index].id)
                    if (pos > -1) {
                      // Remove item from selecton
                      selected.splice(pos, 1)
                    } else {
                      selected.push(tags[virtualItem.index].id)
                    }
                    setSelectedTags(selected)
                  }}
                />
              </ListItemIcon>
              <ListItemText
                primaryTypographyProps={{
                  noWrap: true,
                  textOverflow: 'ellipsis',
                }}
              >
                {tags[virtualItem.index].name}
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
          fullWidth
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}
