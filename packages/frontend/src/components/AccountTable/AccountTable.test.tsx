import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as stories from './AccountTable.stories'

const { Default, Empty } = composeStories(stories)

describe('AccountTable', () => {
  it('renders default account table with rows', async () => {
    render(<Default />)
    await waitFor(() => {
      const institution = document.querySelector('[data-row="institution-1"]') as HTMLElement
      expect(institution).toBeInTheDocument()
      expect(institution).toHaveTextContent('Chase')

      const account = document.querySelector('[data-row="account-122"]') as HTMLElement
      expect(account).toBeInTheDocument()
    })
  })

  it('calls onCreateInstitution when clicking "Add An Institution"', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Empty />
      </ThemeProvider>,
    )
    await waitFor(() => {
      const addLink = screen.getByText('Add An Institution')
      fireEvent.click(addLink)

      const createAccountTitle = screen.getByText('Add Institution')
      expect(createAccountTitle).toBeInTheDocument()
    })
  })

  it('opens context menu on institution row right-click', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )
    await waitFor(() => {
      const row = document.querySelector('[data-row="account-123"]') as HTMLElement
      expect(row).toBeInTheDocument()
      fireEvent.contextMenu(row)

      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})
