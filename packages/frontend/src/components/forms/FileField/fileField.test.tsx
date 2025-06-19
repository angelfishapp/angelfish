import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'

import * as stories from './FileField.stories'

const { Default, Multiple, WithFileTypes } = composeStories(stories)

describe('FileField Component', () => {
  it('renders the Default story correctly', () => {
    render(<Default {...Default.args} />)
    expect(screen.getByPlaceholderText('Select File')).toBeInTheDocument()
    expect(screen.getByText('Click the button to select a file.')).toBeInTheDocument()
  })

  it('renders the Multiple story correctly', () => {
    render(<Multiple {...Multiple.args} />)
    expect(screen.getByPlaceholderText('Select Files')).toBeInTheDocument()
  })

  it('renders the WithFileTypes story correctly', () => {
    render(<WithFileTypes {...WithFileTypes.args} />)
    expect(screen.getByPlaceholderText('Select Images')).toBeInTheDocument()
  })
})
