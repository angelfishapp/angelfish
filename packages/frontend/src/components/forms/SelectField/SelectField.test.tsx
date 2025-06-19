import { composeStories } from '@storybook/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import * as stories from './SelectField.stories'

const { Default } = composeStories(stories)

describe('SelectField tests ', () => {
  it('renders without crashing', async () => {
    render(<Default />)
    await waitFor(() => {
      expect(screen.getByText('Select Field')).toBeInTheDocument()

      const input = screen.getByRole('combobox')
      expect(input).toBeInTheDocument()
      fireEvent.mouseDown(input)

      const option1 = document.querySelector('[data-value="1"]') as HTMLElement
      expect(option1).toBeInTheDocument()
      expect(option1).toHaveTextContent('Option 1')
      fireEvent.mouseDown(option1)
      const selectedOption = screen.getByText('Option 1')
      expect(selectedOption).toBeInTheDocument()
    })
  })
})
