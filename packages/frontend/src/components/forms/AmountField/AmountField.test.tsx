import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './AmountField.stories'

const { Default, DefaultValue } = composeStories(stories)

describe('renders AmountField Story', () => {
  test('render of default Story', async () => {
    render(<Default />)

    const [title] = screen.getAllByText(/Amount/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    const DollarSign = screen.getByText('$')
    expect(DollarSign).toBeInTheDocument()
    const helperText = screen.getByText(/Enter amount/i)
    expect(helperText).toBeInTheDocument()
    fireEvent.change(input, { target: { value: 'alpahpet' } })
    expect(input.value).toBe('')
    fireEvent.change(input, { target: { value: 22 } })
    expect(!isNaN(Number(input.value))).toBe(true)
  })
  test('render of DefaultValue Story', async () => {
    render(<DefaultValue />)

    const [title] = screen.getAllByText(/Amount/i)
    expect(title).toBeInTheDocument()
    const input = screen.getByRole('textbox') as HTMLInputElement
    expect(input).toBeInTheDocument()
    const DollarSign = screen.getByText('£')
    expect(DollarSign).toBeInTheDocument()
    expect(input.value).toBe('1,222.22')
    fireEvent.change(input, { target: { value: 'alpahpet' } })
    expect(input.value).toBe('')
    fireEvent.change(input, { target: { value: 22 } })
    expect(!isNaN(Number(input.value))).toBe(true)
  })
})
