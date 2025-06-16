import { Emoji } from '@/components/Emoji'
import InfoIcon from '@mui/icons-material/Info'
import { Checkbox, ListItem, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { Avatar } from '@/components/Avatar'
import { BankIcon } from '@/components/BankIcon'
import type { IAccount } from '@angelfish/core'
import type React from 'react'

type RenderOptionProps = {
  props: React.HTMLAttributes<HTMLLIElement> & { key: string }
  option: IAccount
  selected: IAccount[]
  setSelected: React.Dispatch<React.SetStateAction<IAccount[]>>
  disableTooltip: boolean
  label: string
}

export const RenderOption: React.FC<RenderOptionProps> = ({
  props,
  option,
  selected,
  setSelected,
  disableTooltip,
  label,
}) => {
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
  // Special "Create new" option
  if (option.id === 0) {
    return (
      <ListItem key={option.id} {...rest}>
        <Box display="flex" alignItems="center" width="100%">
          <Box>
            <Emoji size={24} emoji={option.cat_icon ?? ''} />
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
          {label === 'Currencies' && (
            <img
              src={'/assets/svg/flags/4x3/' + option?.flag + '.svg'}
              alt={option.name}
              width={20}
              style={{ marginRight: 10 }}
              loading="lazy"
            />
          )}
          {label === 'Institutions' ? (
            <BankIcon logo={option?.logo} size={24} />
          ) : label === 'Users' ? (
            <Avatar
              avatar={option?.avatar}
              size={30}
              displayBorder={true}
            />
          ) : option.class === 'ACCOUNT' ? (
            <BankIcon logo={option.institution?.logo} size={24} />
          ) : (
            <Emoji size={24} emoji={option.cat_icon ?? ''} />
          )}
        </Box>
        <Box minWidth={200} flexGrow={1}>
          <Typography style={{ lineHeight: 1.1 }} noWrap>
            {option.name}
          </Typography>
          <Typography style={{ lineHeight: 1.1 }} color="textSecondary" noWrap>
            {option.class === 'ACCOUNT'
              ? option.institution?.name && option.institution?.name
              : option.categoryGroup?.type &&
                `${option.categoryGroup?.type} - ${option.categoryGroup?.name}`}{' '}
          </Typography>
        </Box>
        {!disableTooltip && (
          <Box>
            <Tooltip
              title={option.class === 'ACCOUNT' ? 'Account Transfer' : option.cat_description}
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
