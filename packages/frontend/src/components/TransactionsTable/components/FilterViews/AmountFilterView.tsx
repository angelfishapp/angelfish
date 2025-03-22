import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale } from 'chart.js'
import * as d3 from 'd3'
import React from 'react'
import { Chart } from 'react-chartjs-2'

import theme from '@/app/theme'
import { AmountField } from '@/components/forms/AmountField'
import type { FilterViewProps } from './FilterView.interface'

ChartJS.register(CategoryScale, BarElement, LinearScale)

/**
 * Main Filter Component for Amount Column
 */
export default function AmountFilterView({ table, column, onClose }: FilterViewProps) {
  const hasData = column.getFacetedRowModel().rows.length > 0 ? true : false
  const filterValue = column.getFilterValue() as number[]

  // Calculate min/max and make sure positive
  // along with histogram buckets
  const [min, max, bins] = React.useMemo(() => {
    const filteredRows = table.getCoreRowModel().rows
    let min = hasData ? filteredRows[0].getValue<number>(column.id) : 0
    let max = hasData ? filteredRows[0].getValue<number>(column.id) : 0

    const values: number[] = []
    filteredRows.forEach((row) => {
      let value = row.getValue<number>(column.id)
      // Convert negative numbers to positive
      if (value < 0) {
        value = value * -1
      }
      values.push(value)
      min = Math.min(value, min < 0 ? 0 : min)
      max = Math.max(value, max < 0 ? 0 : max)
    })

    // Generate histogram
    let histBins
    if (hasData) {
      const histGenerator = d3.bin().domain([min, max]).thresholds(40)
      histBins = histGenerator(values).map((bin) => ({
        min: bin.x0,
        max: bin.x1,
        count: bin.length,
      }))
    }

    return [min, max, histBins]
  }, [table, column, hasData])

  // Component State
  const initialMin = filterValue ? filterValue[0] : min
  const initialMax = filterValue ? filterValue[1] : max
  const [currentValueRange, setCurrentValueRange] = React.useState<number[]>([
    initialMin,
    initialMax,
  ])

  // Update Column Filter
  React.useEffect(() => {
    if (currentValueRange[0] === min && currentValueRange[1] === max) {
      column.setFilterValue(undefined)
    } else {
      column.setFilterValue([currentValueRange[0], currentValueRange[1]])
    }
  }, [column, currentValueRange, max, min])

  // Render
  return (
    <Grid container spacing={1} width={400} padding={1}>
      <Grid item xs={12}>
        {/* Histogram Chart */}
        <Chart
          type="bar"
          height={100}
          data={{
            labels: bins?.map(({ min, max }) => `$${min}-$${max}`),
            datasets: [
              {
                label: 'Amounts',
                data: bins?.map(({ count }) => count),
                borderWidth: 0,
                backgroundColor: bins?.map(({ max }) => {
                  if (
                    (max as number) < currentValueRange[0] ||
                    (max as number) > currentValueRange[1]
                  )
                    return theme.palette.grey[500]

                  return theme.palette.primary.main
                }),
                hoverBackgroundColor: theme.palette.primary.light,
              },
            ],
          }}
          options={{
            animation: {
              duration: 0,
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
      </Grid>
      <Grid item xs={12} padding={2} alignContent="center">
        <Slider
          min={min}
          max={max}
          disabled={!hasData}
          value={currentValueRange}
          onChange={(_, newValueRange) => {
            setCurrentValueRange(newValueRange as number[])
          }}
          sx={{
            marginLeft: 2,
            width: 'calc(100% - 4px)',
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <AmountField
          label="Min"
          fullWidth
          margin="dense"
          id="filterValueMin"
          disabled={!hasData}
          value={currentValueRange[0]}
          onChange={(value) => {
            const currentMax = currentValueRange[1]
            setCurrentValueRange([value, currentMax])
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <AmountField
          label="Max"
          fullWidth
          margin="dense"
          id="filterValueMax"
          disabled={!hasData}
          value={currentValueRange[1]}
          onChange={(value) => {
            const currentMin = currentValueRange[0]
            setCurrentValueRange([currentMin, value])
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ marginBottom: 1 }} />
        <Button
          fullWidth
          onClick={() => {
            column.setFilterValue(undefined)
            onClose()
          }}
        >
          Clear
        </Button>
      </Grid>
    </Grid>
  )
}
