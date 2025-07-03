import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import {
  endOfMonth,
  endOfQuarter,
  endOfYear,
  format,
  parse,
  startOfMonth,
  startOfQuarter,
  startOfYear,
  subMonths,
  subQuarters,
  subYears,
} from 'date-fns'
import React, { useEffect, useState } from 'react'

import { exportReport, showSaveDialog } from '@/api'
import { DropdownMenuButton } from '@/components/DropdownMenuButton'
import { DateRangeField } from '@/components/forms/DateRangeField'
import { RollingContainer, RollingContainerScrollBar } from '@/components/RollingContainer'
import {
  useDeleteTransaction,
  useListAllAccountsWithRelations,
  useListTags,
  useListTransactions,
  useRunReport,
  useSaveTransactions,
} from '@/hooks'
import type { AppCommandRequest, ITransactionUpdate, ReportsQuery } from '@angelfish/core'
import { type AppCommandIds } from '@angelfish/core'
import { PeriodDetailDrawer } from './components/PeriodDetailDrawer'
import { ReportsChart } from './components/ReportsChart'
import { ReportsSettingsDrawer } from './components/ReportsSettingsDrawer'
import { ReportsTable } from './components/ReportsTable'
import { renderPeriodHeader } from './Reports.utils'

/**
 * Reports Page
 */

export default function Reports() {
  /**
   * Default Date Ranges for Date Range Selector
   */
  const today = new Date()
  const startOfToday = new Date(today.setHours(0, 0, 0, 0))

  const dateRanges = {
    'This Month': { start: startOfMonth(startOfToday), end: startOfToday },
    'Last Month': {
      start: startOfMonth(subMonths(startOfToday, 1)),
      end: endOfMonth(subMonths(startOfToday, 1)),
    },
    'This Quarter': { start: startOfQuarter(startOfToday), end: endOfQuarter(startOfToday) },
    'Last Quarter': {
      start: startOfQuarter(subQuarters(startOfToday, 1)),
      end: endOfQuarter(subQuarters(startOfToday, 1)),
    },
    'This Year To Date': { start: startOfYear(startOfToday), end: startOfToday },
    'This Year': { start: startOfYear(startOfToday), end: endOfYear(startOfToday) },
    'Last 12 Months': { start: subMonths(startOfToday, 12), end: startOfToday },
    'Last Year': {
      start: startOfYear(subYears(startOfToday, 1)),
      end: endOfYear(subYears(startOfToday, 1)),
    },
  }

  // Component State
  const [reportsQuery, setReportsQuery] = React.useState<ReportsQuery>({
    start_date: format(dateRanges['Last 12 Months'].start, 'yyyy-MM-dd'),
    end_date: format(dateRanges['Last 12 Months'].end, 'yyyy-MM-dd'),
    include_unclassified: true,
  })
  const [showPeriodDetailDrawer, setShowPeriodDetailDrawer] = React.useState<boolean>(false)
  const [periodDetailDrawerTitle, setPeriodDetailDrawerTitle] = React.useState<string>('')
  const [showSettingsDrawer, setShowSettingsDrawer] = React.useState<boolean>(false)
  const [transactionQuery, setTransactionQuery] = React.useState<
    AppCommandRequest<AppCommandIds.LIST_TRANSACTIONS>
  >({})

  // React Query Hooks
  const { transactions, isFetching: isLoadingTransactions } = useListTransactions(transactionQuery)
  const transactionSaveMutation = useSaveTransactions()
  const transactionDeleteMutation = useDeleteTransaction()
  const { accounts } = useListAllAccountsWithRelations()
  const { tags } = useListTags()
  const { reportData } = useRunReport(reportsQuery)

  /**
   * Callback to save Transactions to the Database
   */
  const onSaveTransactions = React.useCallback(
    async (transactions: ITransactionUpdate[]) => {
      transactionSaveMutation.mutate(transactions)
    },
    [transactionSaveMutation],
  )

  /**
   * Delete a Transaction from the Database
   */
  const onDeleteTransaction = React.useCallback(
    async (id: number) => {
      transactionDeleteMutation.mutate({ id })
    },
    [transactionDeleteMutation],
  )

  /**
   * Click hanlder for when user clicks on a cell value on the table
   * Will open a drawer with transactions for that period and category/group
   *
   * @param period            The period for the cell clicked
   * @param id                The category/group id of the row
   * @param isCategoryGroup   Whether the row is a category or group
   */
  const handleClick = React.useCallback(
    (period: string, name: string, id: number, isCategoryGroup = false) => {
      setPeriodDetailDrawerTitle(`${renderPeriodHeader(period)}: ${name}`)
      setTransactionQuery({
        start_date:
          period != 'total'
            ? format(startOfMonth(parse(period, 'MM-yyyy', new Date())), 'yyyy-MM-dd')
            : reportsQuery.start_date,
        end_date:
          period != 'total'
            ? format(endOfMonth(parse(period, 'MM-yyyy', new Date())), 'yyyy-MM-dd')
            : reportsQuery.end_date,
        ...(isCategoryGroup ? { cat_group_id: id } : { cat_id: id }),
      })
      setShowPeriodDetailDrawer(true)
    },
    [
      setPeriodDetailDrawerTitle,
      setTransactionQuery,
      setShowPeriodDetailDrawer,
      reportsQuery.start_date,
      reportsQuery.end_date,
    ],
  )
  // calculating the width for first col in the table and make it the same for range Date section so it would
  // be aligned with the table header in chart case of resizing the window

  const [dateRangeSectionWidth, setDateRangeSectionWidth] = useState('332px')

  const cols = Array.from(
    document.getElementsByClassName(' MuiTableCell-head'),
  ) as Array<HTMLElement>

  const chartWidth = cols.filter(
    (item) =>
      item.className.includes('col-id-') &&
      !item.className.includes('col-id-name') &&
      !item.className.includes('col-id-total'),
  )[0]?.offsetWidth

  const headingCol = document.getElementsByClassName('isPinned')[1] as HTMLElement

  useEffect(() => {
    const handleResize = () => {
      setDateRangeSectionWidth(headingCol?.offsetWidth.toString() + 'px')
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [headingCol?.offsetWidth, reportsQuery, reportData])
  // Render
  return (
    <Box padding={2}>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Box display="flex" flexGrow={1}>
          <Typography
            variant="h5"
            sx={{
              color: (theme) => theme.palette.common.white,
              fontWeight: 700,
              marginBottom: (theme) => theme.spacing(1),
            }}
            noWrap
          >
            Monthly Income and Expenses
          </Typography>
        </Box>
        <Paper
          sx={{
            padding: '0 !important',
            overflow: 'hidden',
          }}
        >
          <RollingContainer showSyncScrollbar={true} syncScrollbarPosition="external">
            <>
              <Box
                display="flex"
                width="100%"
                minWidth={`${reportData.periods.length * 150 + 300}px`}
              >
                <Box
                  width={dateRangeSectionWidth}
                  flex="none"
                  borderRight="1px solid transparent"
                  bgcolor="white"
                  left="0"
                  zIndex="1"
                  className="isPinned left"
                  p={3}
                >
                  <DateRangeField
                    value={{
                      start: parse(reportsQuery.start_date, 'yyyy-MM-dd', new Date()),
                      end: parse(reportsQuery.end_date, 'yyyy-MM-dd', new Date()),
                    }}
                    onChange={(range) => {
                      setReportsQuery({
                        start_date: format(range.start, 'yyyy-MM-dd'),
                        end_date: format(range.end, 'yyyy-MM-dd'),
                        include_unclassified: reportsQuery.include_unclassified,
                      })
                    }}
                    dateRanges={dateRanges}
                    maxDate={new Date()}
                    border={false}
                    displayRangeLabel={true}
                    endAdornment={<ExpandMoreIcon />}
                  />
                </Box>
                <Box flex={1}>
                  <Box py={3} display="flex" justifyContent="flex-end" alignItems="center">
                    <Box paddingRight={3} position="sticky" display="flex" right={0}>
                      <Box marginRight={2}>
                        <Button
                          variant="outlined"
                          style={{ border: 'none' }}
                          onClick={() => setShowSettingsDrawer(true)}
                        >
                          Settings
                        </Button>
                      </Box>
                      <Box>
                        <DropdownMenuButton
                          label="Export"
                          variant="outlined"
                          style={{ border: 'none' }}
                          menuItems={[
                            {
                              label: 'Excel (XLSX)',
                              disabled: false,
                              onClick: async () => {
                                const filePath = await showSaveDialog({
                                  title: 'Export Report to Excel (XLSX)',
                                  defaultPath: `Angelfish_IncomeExpenseReport_${reportsQuery.start_date}_To_${reportsQuery.end_date}.xlsx`,
                                  filters: [{ name: 'Excel', extensions: ['xlsx'] }],
                                })

                                if (filePath) {
                                  exportReport({
                                    filePath,
                                    fileType: 'XLSX',
                                    query: reportsQuery,
                                  })
                                }
                              },
                            },
                          ]}
                          position={{ vertical: 'bottom', horizontal: 'left' }}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <ReportsChart data={reportData} chartWidth={chartWidth} />
                  <RollingContainerScrollBar id="chart" />
                </Box>
              </Box>
              <ReportsTable data={reportData} onClick={handleClick} />
            </>
          </RollingContainer>
        </Paper>
      </Box>
      <PeriodDetailDrawer
        accountsWithRelations={accounts}
        open={showPeriodDetailDrawer}
        tags={tags}
        title={periodDetailDrawerTitle}
        transactions={transactions}
        isLoading={isLoadingTransactions}
        onClose={() => {
          setShowPeriodDetailDrawer(false)
        }}
        onCreateCategory={() => {}}
        onDeleteTransaction={onDeleteTransaction}
        onSaveTransactions={onSaveTransactions}
      />
      <ReportsSettingsDrawer
        initialQuery={reportsQuery}
        open={showSettingsDrawer}
        onClose={() => setShowSettingsDrawer(false)}
        onSave={(query) => {
          setReportsQuery(query)
          setShowSettingsDrawer(false)
        }}
      />
    </Box>
  )
}
