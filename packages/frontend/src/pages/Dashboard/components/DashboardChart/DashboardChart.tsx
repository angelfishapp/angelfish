import Box from '@mui/material/Box'
import React from 'react'

import type { DashboardChartProps } from './DashboardChart.interface'
import { StyledHeader } from './DashboardChart.styles'

/**
 * Wrapper Chart Component to render title and description of a chart
 */
export default function DashboardChart({
  children,
  title,
  description = null,
}: DashboardChartProps) {
  // Render
  return (
    <React.Fragment>
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: 'white',
          marginBottom: '2rem',
        }}
      >
        <StyledHeader>{title}</StyledHeader>
        <div>{description}</div>
      </Box>

      <Box>{children}</Box>
    </React.Fragment>
  )
}
