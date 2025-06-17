import { Emoji } from '@/components/Emoji'
import InfoIcon from '@mui/icons-material/Info'
import { Checkbox, ListItem, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { BankIcon } from '@/components/BankIcon'
import type { IAccount, IInstitution, ITag } from '@angelfish/core'
import type React from 'react'

type RenderOptionProps<T extends IAccount | IInstitution | ITag> = {
  props: React.HTMLAttributes<HTMLLIElement> & { key: string }
  option: T
  selected: T[]
  setSelected: (value: T[]) => void
  disableTooltip: boolean
  label: string
}

export function RenderOption<T extends IAccount | IInstitution | ITag>({
  props,
  option,
  selected,
  setSelected,
  disableTooltip,
  label,
}: RenderOptionProps<T>) {
  const { key: _key, ...rest } = props
  const isSelected = selected.some((s) => s.id === option.id)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSelected) {
      setSelected(selected.filter((s) => s.id !== option.id))
    } else {
      setSelected([...selected, option])
    }
  }

  // خاصية "Create new" إذا الـ id = 0
  if (option.id === 0) {
    return (
      <ListItem key={option.id} {...rest}>
        <Box display="flex" alignItems="center" width="100%">
          <Box>
            <Emoji size={24} emoji={(option as IAccount).cat_icon ?? ''} />
          </Box>
          <Box minWidth={200} flexGrow={1}>
            <Typography style={{ lineHeight: 1.1 }}>{option.name}</Typography>
          </Box>
        </Box>
      </ListItem>
    )
  }

  return (
    <ListItem key={option.id} {...rest}>
      <Checkbox checked={isSelected} onClick={handleToggle} />
      <Box display="flex" alignItems="center" width="100%">
        <Box marginRight={1} width={30}>
          {label === 'Institutions' ? (
            <BankIcon logo={(option as IInstitution).logo} size={24} />
          ) : (option as IAccount).class === 'ACCOUNT' ? (
            <BankIcon logo={(option as IAccount).institution?.logo} size={24} />
          ) : (
            <Emoji size={24} emoji={(option as IAccount).cat_icon ?? ''} />
          )}
        </Box>
        <Box minWidth={200} flexGrow={1}>
          <Typography style={{ lineHeight: 1.1 }} noWrap>
            {option.name}
          </Typography>
          <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
            {(option as IAccount).class === 'ACCOUNT'
              ? (option as IAccount).institution?.name && (option as IAccount).institution?.name
              : (option as IAccount).categoryGroup?.type &&
                `${(option as IAccount).categoryGroup?.type} - ${(option as IAccount).categoryGroup?.name}`}{' '}
          </Typography>
        </Box>
        {!disableTooltip && (
          <Box>
            <Tooltip
              title={
                (option as IAccount).class === 'ACCOUNT'
                  ? 'Account Transfer'
                  : (option as IAccount).cat_description
              }
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
