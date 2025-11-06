import type { CategorySpendReportResults } from '@angelfish/core'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './IncomeAndExpensesSankey.stories'

const { Default } = composeStories(stories)

describe('IncomeAndExpensesSankey', () => {
  it('renders the Default story correctly', () => {
    const { container } = render(<Default />)

    expect(screen.getByText('Income & Expenses')).toBeInTheDocument()

    expect(screen.getByText(/Your avarage monthly income is/)).toBeInTheDocument()

    expect(container.querySelector('.MuiSlider-root')).toBeInTheDocument()

    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('displays "No Income this month" when there is no income data for the selected month', () => {
    const { container } = render(
      <Default
        data={
          {
            ...Default.args.data,
            rows: Default?.args?.data?.rows?.filter((row) => row.type !== 'Income'),
          } as CategorySpendReportResults
        }
      />,
    )

    expect(screen.getByText('No Income this month')).toBeInTheDocument()

    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('displays "No Expenses this month" when there is no expense data for the selected month', () => {
    const { container } = render(
      <Default
        data={
          {
            ...Default.args.data,
            rows: Default?.args?.data?.rows?.filter((row) => row.type !== 'Expense'),
          } as CategorySpendReportResults
        }
      />,
    )

    expect(screen.getByText('No Expenses this month')).toBeInTheDocument()

    expect(container.querySelector('canvas')).toBeInTheDocument()
  })

  it('renders the Sankey chart with correct data', () => {
    const { container } = render(<Default />)

    expect(container.querySelector('canvas')).toBeInTheDocument()

    expect(container.querySelector('.MuiSlider-root')).toBeInTheDocument()
  })
})
