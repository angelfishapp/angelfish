import { Checkbox, Collapse, Typography, Box } from '@mui/material'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import React from 'react'

export const MultiSelectGroupRender: React.FC = ({ params, isCollapsed, handleGroupToggle, isGroupChecked, handleGroupSelect }: any) => {
    return (
        <Box key={params.key}>
            <Box
                display="flex"
                alignItems="center"
                px={2}
                py={1}
                sx={{ backgroundColor: '#f5f5f5', cursor: 'pointer' }}
                onClick={() => handleGroupToggle(params.group)}
            >
                {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                <Box display="flex" alignItems="center">
                    <Checkbox
                        size="small"
                        checked={isGroupChecked(params.group)}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleGroupSelect(params.group, !isGroupChecked(params.group))
                        }}
                    />
                    <Typography variant="subtitle2">{params.group}</Typography>
                </Box>
            </Box>
            <Collapse in={!isCollapsed}>{params.children}</Collapse>
        </Box>
    )
}
export default MultiSelectGroupRender
