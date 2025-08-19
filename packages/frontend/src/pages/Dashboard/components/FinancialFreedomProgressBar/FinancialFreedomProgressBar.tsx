import Box from '@mui/material/Box'
import React from 'react'

import { CurrencyLabel } from '@/components/CurrencyLabel'
import { useTranslate } from '@/utils/i18n'
import { DashboardChart } from '../DashboardChart'
import type { FinancialFreedomProgressBarProps } from './FinancialFreedomProgressBar.interface'
import {
  ProgressBar,
  ProgressBarIcon,
  ProgressBarWrapper,
  Tooltip,
  TooltipBar,
} from './FinancialFreedomProgressBar.styled'

/**
 * Display a progress bar that shows the financial freedom index for the user based on their past 12 months of expenses:
 *
 * - The progress bar should show the following:
 *  - The total passive income for the past 12 months
 *  - The total expenses for the past 12 months
 *  - The total critical expenses for the past 12 months
 *  - The total important expenses for the past 12 months
 */
export default function FinancialFreedomProgressBar({
  currency,
  data,
}: FinancialFreedomProgressBarProps) {
  const { dashboard: t } = useTranslate('pages')
  // Component State
  const [animate, setAnimate] = React.useState(false)

  /**
   * Calculate the following numbers from the data:
   *
   * - average monthly passive income for past 12 months
   * - average monthly total expenses for past 12 months
   * - average monthly total critical expenses for past 12 months
   * - average monthly total important expenses for past 12 months
   */
  const {
    periods,
    avePassiveIncome,
    aveCriticalExpenses,
    aveImportantExpenses,
    aveTotalExpenses,
    progress,
  } = React.useMemo(() => {
    // Calculate number of periods in the data without 'total' column
    const periods = data?.periods?.length - 1 || 0

    // Loop through each row categories and calculate the total for each category type
    let avePassiveIncome = 0
    let aveTotalExpenses = 0
    let aveCriticalExpenses = 0
    let aveImportantExpenses = 0
    data?.rows?.forEach((row) => {
      row?.categories?.forEach((category) => {
        switch (category.type) {
          case 'Passive':
            avePassiveIncome += category.total
            break
          case 'Critical':
            aveTotalExpenses += category.total
            aveCriticalExpenses += category.total
            break
          case 'Important':
            aveTotalExpenses += category.total
            aveImportantExpenses += category.total
            break
          case 'Optional':
          case 'Investment':
            aveTotalExpenses += category.total
            break
          case 'Unknown':
            // Handle unclassified expenses
            if (category.name === 'Unclassified Expenses') {
              aveTotalExpenses += category.total
            }
        }
      })
    })

    // Calculate the average for each category type
    avePassiveIncome = avePassiveIncome / periods
    aveTotalExpenses = (aveTotalExpenses * -1) / periods
    aveCriticalExpenses = (aveCriticalExpenses * -1) / periods
    aveImportantExpenses = (aveImportantExpenses * -1) / periods

    // Calculate the progress
    const progress = (avePassiveIncome / aveTotalExpenses) * 100

    return {
      periods,
      avePassiveIncome,
      aveCriticalExpenses,
      aveImportantExpenses,
      aveTotalExpenses,
      progress,
    }
  }, [data])

  React.useEffect(() => {
    requestAnimationFrame(() => setAnimate(true))
  }, [data])

  // Render
  return (
    <DashboardChart
      title={t['financialFreedomIndex']}
      description={
        <Box mx="auto" maxWidth={460}>
          {progress > 99 ? (
            <>{t['greatJob']}</>
          ) : (
            <>
              {t['financialFreedom']}
              {periods} {t['financialFreedomMonths']}{' '}
              <b>
                <CurrencyLabel
                  value={Math.round(aveTotalExpenses - avePassiveIncome)}
                  currency={currency}
                  displayDecimals={false}
                />
                /{t['month']}
              </b>{' '}
              {t['passive']}
            </>
          )}
        </Box>
      }
    >
      {!data ? (
        <Box textAlign="center">{t['noDataFound']}</Box>
      ) : (
        <Box mx={4} style={{ position: 'relative', marginTop: '8rem', marginBottom: '8rem' }}>
          <ProgressBarWrapper>
            <ProgressBarIcon>🙌</ProgressBarIcon>
            <ProgressBar $width={animate ? Math.min(progress, 100) : 0} />
          </ProgressBarWrapper>
          <Tooltip
            $background="linear-gradient(90deg, #20a4d4 0.2%, #44ccb2 77.79%)"
            $left={animate ? Math.min(progress, 99.6) : 0}
            $position="bottom"
            $translateX={-52}
          >
            <TooltipBar $position="top" $size={0.2} />
            <div>{t['passiveIncome']}</div>
            <div>
              <CurrencyLabel value={avePassiveIncome} currency={currency} displayDecimals={false} />
              /{t['month']} ({Math.round(progress) + '%'})
            </div>
          </Tooltip>
          {aveCriticalExpenses && (
            <Tooltip
              $background="#f16873"
              $left={Math.min((aveCriticalExpenses / aveTotalExpenses) * 100, 100)}
              $position="top"
            >
              <TooltipBar />
              <div>{t['criticalExpenses']}</div>
              <div>
                <CurrencyLabel
                  value={aveCriticalExpenses}
                  currency={currency}
                  displayDecimals={false}
                />
                /{t['month']}
              </div>
            </Tooltip>
          )}
          {aveImportantExpenses && (
            <Tooltip
              $background="#ff9553"
              $left={
                Math.min((aveCriticalExpenses / aveTotalExpenses) * 100, 100) +
                Math.min((aveImportantExpenses / aveTotalExpenses) * 100, 100)
              }
              $position="top"
            >
              <TooltipBar />
              <div>{t['importantExpenses']}</div>
              <div>
                <CurrencyLabel
                  value={aveCriticalExpenses + aveImportantExpenses}
                  currency={currency}
                  displayDecimals={false}
                />
                /{t['month']}
              </div>
            </Tooltip>
          )}
          <Tooltip $background="#145579" $position="top" $left={100}>
            <div>{t['totalExpenses']}</div>
            <div>
              <CurrencyLabel value={aveTotalExpenses} currency={currency} displayDecimals={false} />
              /{t['month']}
            </div>
          </Tooltip>
        </Box>
      )}
    </DashboardChart>
  )
}
