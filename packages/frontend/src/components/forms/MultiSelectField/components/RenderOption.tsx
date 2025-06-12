import { Emoji } from '@/components/Emoji'
import InfoIcon from '@mui/icons-material/Info'
import { Checkbox, ListItem, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { BankIcon } from '@/components/BankIcon'
import type { IAccount } from '@angelfish/core'
import type React from 'react'

/**
 * Props used to render an individual option in a multi-select Autocomplete component.
 */
type RenderOptionProps = {
  /**
   * HTML attributes to apply to the option's root `<li>` element.
   * Includes a required `key` property for React rendering.
   */
  props: React.HTMLAttributes<HTMLLIElement> & {
    key: string
  }

  /**
   * The account option data being rendered in the list.
   */
  option: IAccount

  /**
   * The current list of selected account options.
   */
  selected: IAccount[]

  /**
   * Setter function to update the selected account options.
   */
  setSelected: React.Dispatch<React.SetStateAction<IAccount[]>>

  /**
   * Whether to disable tooltips on this option.
   */
  disableTooltip: boolean
}

export const RenderOption: React.FC<RenderOptionProps> = ({
  props,
  option,
  selected,
  setSelected,
  disableTooltip,
}) => {
  // Remove the key from props to avoid React warning about
  // spread JSX and duplicate keys
  const { key: _key, ...rest } = props

  if (option.id == 0) {
    // Render Create Category Option if onCreate provided
    return (
      <ListItem key={option.id} {...rest}>
        <Box display="flex" alignItems="center" width="100%">
          <Box>
            <Emoji size={24} emoji={option.cat_icon ?? ''} />
          </Box>
          <Box minWidth={200} flexGrow={1}>
            <Typography style={{ lineHeight: 1.1 }}>{option.name}</Typography>
          </Box>
          <Box></Box>
        </Box>
      </ListItem>
    )
  }
  if (option.class == 'ACCOUNT') {
    // Render Bank Account
    return (
      <ListItem key={option.id} {...rest}>
        <Box display="flex" alignItems="center" width="100%">
          <Checkbox
            checked={selected.some((s) => s.id === option.id)}
            onClick={(e) => {
              e.stopPropagation()
              if (selected.some((s) => s.id === option.id)) {
                setSelected(selected.filter((s) => s.id !== option.id))
              } else {
                setSelected([...selected, option])
              }
            }}
          />
          <Box marginRight={1}>
            <BankIcon logo={option.institution?.logo} size={24} />
          </Box>
          <Box minWidth={200} flexGrow={1}>
            <Typography style={{ lineHeight: 1.1 }} noWrap>
              {option.name}
            </Typography>
            <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
              {option.institution?.name}
            </Typography>
          </Box>
          {!disableTooltip && (
            <Box>
              <Tooltip
                title="Account Transfer"
                placement="right"
                slotProps={{
                  tooltip: {
                    sx: {
                      maxWidth: 200,
                      backgroundColor: (theme) => theme.palette.grey[400],
                      fontSize: '1em',
                    },
                  },
                }}
              >
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
          )}
        </Box>
      </ListItem>
    )
  }
  if (option.class == 'ACCOUNT') {
    // Render Bank Account
    return (
      <ListItem key={option.id} {...rest}>
        <Box display="flex" alignItems="center" width="100%">
          <Box marginRight={1}>
            <BankIcon logo={option.institution?.logo} size={24} />
          </Box>
          <Box minWidth={200} flexGrow={1}>
            <Typography style={{ lineHeight: 1.1 }} noWrap>
              {option.name}
            </Typography>
            <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
              {option.institution?.name}
            </Typography>
          </Box>
          {!disableTooltip && (
            <Box>
              <Tooltip
                title="Account Transfer"
                placement="right"
                slotProps={{
                  tooltip: {
                    sx: {
                      maxWidth: 200,
                      backgroundColor: (theme) => theme.palette.grey[400],
                      fontSize: '1em',
                    },
                  },
                }}
              >
                <InfoIcon fontSize="small" color="primary" />
              </Tooltip>
            </Box>
          )}
        </Box>
      </ListItem>
    )
  }

  // Render Category
  return (
    <ListItem key={option.id} {...rest}>
      <Box display="flex" alignItems="center" width="100%">
        <Box marginRight={1} width={30}>
          <Emoji size={24} emoji={option.cat_icon ?? ''} />
        </Box>
        <Box minWidth={200} flexGrow={1}>
          <Typography style={{ lineHeight: 1.1 }} noWrap>
            {option.name}
          </Typography>
          <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
            {`${option.categoryGroup?.type} - ${option.categoryGroup?.name}`}
          </Typography>
        </Box>
        {!disableTooltip && (
          <Box>
            <Tooltip
              title={option.cat_description}
              placement="right"
              slotProps={{
                tooltip: {
                  sx: {
                    maxWidth: 200,
                    backgroundColor: (theme) => theme.palette.grey[400],
                    fontSize: '1em',
                  },
                },
              }}
            >
              <InfoIcon fontSize="small" color="primary" />
            </Tooltip>
          </Box>
        )}
      </Box>
    </ListItem>
  )
}
