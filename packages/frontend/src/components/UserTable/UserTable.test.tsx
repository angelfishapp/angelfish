import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as TableStories from './UserTable.stories'

const { Default, Empty } = composeStories(TableStories)

describe('Table component stories', () => {
  it('renders Default table with data', async () => {
    render(<Default />)

    await waitFor(() => {
      expect(screen.getByText('Avatar')).toBeInTheDocument()
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Created On')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()
    })
  })

  it('renders EmptyTable with no data', async () => {
    render(<Empty />)
    await waitFor(() => {
      expect(screen.getByText('Avatar')).toBeInTheDocument()
      expect(screen.getByText('First Name')).toBeInTheDocument()
      expect(screen.getByText('Last Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Role')).toBeInTheDocument()
      expect(screen.getByText('Created On')).toBeInTheDocument()
      expect(screen.getByText('Actions')).toBeInTheDocument()

      expect(screen.queryByText('No Data')).toBeInTheDocument()
    })
  })
})
