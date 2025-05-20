import { Emoji } from '@/components/Emoji'
import InfoIcon from '@mui/icons-material/Info'

import { Checkbox, ListItem, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

export const MutliSelectOption: React.FC = ({ props, option, selected, setSelected, disableTooltip }: any) => {
    const { key: _key, ...rest } = props

    return (
        <ListItem key={option.id} {...rest}>
            <Checkbox
                checked={selected.some((s) => s.id === option.id)}
                style={{ marginLeft: 40, marginRight: 8 }}
                onClick={(e) => {
                    e.stopPropagation()
                    if (selected.some((s) => s.id === option.id)) {
                        setSelected(selected.filter((s) => s.id !== option.id))
                    } else {
                        setSelected([...selected, option])
                    }
                }}
            />
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
