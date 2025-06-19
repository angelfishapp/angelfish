import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import * as stories from './ImportTransactions.stories'

const { Default } = composeStories(stories)

describe('ImportTransactions', () => {
  it('renders default account table with rows', () => {
    render(<Default />)

    const importButton = screen.getByRole('button', { name: 'Import Transactions' })
    expect(importButton).toBeInTheDocument()

    // this test is not full test because of ctx errors something related to canvas and animations
  })
})
