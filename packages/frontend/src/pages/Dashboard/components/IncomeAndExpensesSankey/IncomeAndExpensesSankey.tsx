import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import {
  Chart as ChartJS,
  registerables,
  Tooltip as ChartTooltip,
  type ChartOptions,
} from 'chart.js'
import { Flow, SankeyController } from 'chartjs-chart-sankey'
import { format, isAfter, parse, subMonths } from 'date-fns'
import { groupBy } from 'lodash-es'
import React, { type ReactNode } from 'react'
import { Chart } from 'react-chartjs-2'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import type { ReportsDataRow } from '@angelfish/core'
import { DashboardChart } from '../DashboardChart'
import type { IncomeAndExpensesSankeyProps } from './IncomeAndExpensesSankey.interface'
import { IncomeAndExpensesSankeyTooltip } from './IncomeAndExpensesSankey.style'

// Register ChartJS Plugins
ChartJS.register(SankeyController, Flow, ChartTooltip, ...registerables)

/**
 * Represents a row of data to display on the Sankey as a Flow
 */
export type DataFlow = ReportsDataRow & {
  from: string
  to: string
  flow: number
}

/**
 * Income And Expenses Comparison Sankey
 */
export default function IncomeAndExpensesSankey({
  currency,
  data,
  periods = 6,
}: IncomeAndExpensesSankeyProps) {
  // Component State
  const [month, setMonth] = React.useState<string>('')

  // Process Data to display on Sankey
  const { dataset, filteredGrouped, filtered } = React.useMemo(() => {
    const group: DataFlow[] = data.rows
      .reduce<DataFlow[]>((acc, { icon, id, name, type, color, categories, total, ...months }) => {
        const data = Object.entries(months).map(([month, value]) => ({
          from: type === 'Income' ? name : '',
          to: type === 'Expense' ? name : '',
          flow: Math.abs(value as number),
          categories,
          icon,
          month,
          name,
          total,
          type,
          color,
          id,
        }))

        return [...acc, ...data]
      }, [])
      .filter((i) => isAfter(parse(i.month, 'MM-yyyy', new Date()), subMonths(new Date(), periods)))

    const filtered = groupBy(
      group.filter((data) => data.flow),
      'month',
    )

    const filteredGrouped = Object.entries(filtered).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: groupBy(value, 'type'),
      }),
      {},
    ) as Record<string, { Income?: DataFlow[]; Expense?: DataFlow[] }>

    return {
      dataset: groupBy(group, 'month'),
      filtered,
      filteredGrouped,
    }
  }, [data, periods])

  // Reset Month when dataset changes
  React.useEffect(() => {
    setMonth(Object.keys(dataset).at(-1) ?? '')
  }, [dataset])

  const averageIncomePerSix =
    data?.rows?.reduce((acc, row) => acc + row.total, 0) / (data?.periods?.length - 1)

  // ChartJS Options
  const options = React.useMemo(
    () =>
      ({
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            external: ({ chart, tooltip }) => {
              // Tooltip Element

              let tooltipEl = document.getElementById('chartjs-tooltip')

              // Create element on first render
              if (!tooltipEl) {
                tooltipEl = document.createElement('div')
                tooltipEl.id = 'chartjs-tooltip'
                document.body.appendChild(tooltipEl)
              }

              // Hide if no tooltip
              if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = '0'
                return
              }

              // Set caret Position
              tooltipEl.classList.remove('above', 'below', 'no-transform')
              if (tooltip.yAlign) {
                tooltipEl.classList.add(tooltip.yAlign)
              } else {
                tooltipEl.classList.add('no-transform')
              }

              // Set Text
              if (tooltip.body) {
                const data = tooltip.dataPoints.at(0)?.raw as ReportsDataRow

                if (data)
                  tooltipEl.innerHTML = `
                <div style="background:black; padding:0.75rem; border-radius: .5rem; color: white">
                  <div><b>${data.name}</b></div>
                  <div>${Math.abs(
                    data?.categories?.reduce(
                      (acc, category) => acc + Number(Math.abs(category[month]).toFixed(2)),
                      0,
                    ) ?? 0,
                  ).toLocaleString('en-US', {
                    style: 'currency',
                    currency,
                  })}</div>
                </div>
                `
              }

              const position = chart.canvas.getBoundingClientRect()

              // Display, position, and set styles for font
              tooltipEl.style.transition =
                'opacity .2s ease-in-out, top .35s ease-in-out, left .35s ease-in-out'
              tooltipEl.style.opacity = '1'
              tooltipEl.style.position = 'absolute'
              tooltipEl.style.left = position.left + window.scrollX + tooltip.caretX + 'px'
              tooltipEl.style.top = position.top + window.scrollY + tooltip.caretY + 'px'
              tooltipEl.style.pointerEvents = 'none'
            },
            enabled: false,
          },
        },
      }) as ChartOptions<'sankey'>,
    [month, currency],
  )

  const marks = React.useMemo(() => {
    return Object.keys(dataset).map((date, index) => {
      const [month, year] = date.split('-')
      return { raw: date, value: index, label: format(new Date(`${month} 1 ${year}`), 'MMM yy') }
    })
  }, [dataset])

  return (
    <DashboardChart
      title="Income & Expenses"
      description={
        <Box mx="auto" maxWidth={460}>
          Your avarage monthly income is{' '}
          <b>
            <CurrencyLabel value={averageIncomePerSix} currency={currency} />
          </b>{' '}
          more than your avarage expenditure over the past 6 months
        </Box>
      }
    >
      {month && filtered[month]?.length ? (
        <Box display="flex">
          <Box
            height="500px"
            width="49.25%"
            display={filteredGrouped[month]?.Income?.length ? 'none' : 'flex'}
            alignItems="center"
            justifyContent="center"
          >
            No Income this month
          </Box>

          <Box
            width={
              !filteredGrouped[month]?.Income?.length || !filteredGrouped[month]?.Expense?.length
                ? '50.25% !important'
                : '100% !important'
            }
          >
            <Chart
              data={{
                datasets: [
                  {
                    data: filtered[month],
                    colorFrom: (item) => {
                      const data: any = item.dataset.data[item.dataIndex]
                      return data.color
                    },
                    colorTo: (item) => {
                      const data: any = item.dataset.data[item.dataIndex]
                      return data.color
                    },
                    borderWidth: 2,
                    borderColor: 'black',
                  },
                ],
              }}
              options={options}
              type="sankey"
              style={{ height: '500px' }}
            />
          </Box>

          <Box
            height="500px"
            width="49.25%"
            display={filteredGrouped[month]?.Expense?.length ? 'none' : 'flex'}
            alignItems="center"
            justifyContent="center"
          >
            No Expenses this month
          </Box>
        </Box>
      ) : (
        <Box height="500px" display="flex" alignItems="center" justifyContent="center">
          No data this month
        </Box>
      )}
      <Slider
        sx={{ mt: 8 }}
        value={marks.find((i) => i.raw === month)?.value ?? 5}
        step={null}
        min={0}
        onChange={(_, value) => {
          const index = Array.isArray(value) ? value[0] : value
          setMonth(marks[index]?.raw)
        }}
        max={marks.length - 1}
        marks={marks}
        slots={{ valueLabel: ToolTipComponent }}
        valueLabelDisplay="on"
      />
    </DashboardChart>
  )
}

/**
 * Custom Tooltip Component used in slider
 */
function ToolTipComponent({ children }: { children: ReactNode }) {
  return (
    <IncomeAndExpensesSankeyTooltip open enterTouchDelay={0} placement="top" title=" ">
      {children}
    </IncomeAndExpensesSankeyTooltip>
  )
}
