import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './CurrencyLabel.stories' // Ensure correct path

const composed = composeStories(stories)

describe('CurrencyLabel', () => {
  test('USD', () => {
    render(<composed.USD />)
    const currencies = screen.getAllByText(/$/i)
    expect(currencies[0]).toBeInTheDocument()
    const amountText = currencies[0].textContent?.replace(/[^0-9.]/g, '')
    expect(amountText).toMatch(/^\d+(\.\d{2})?$/)
  })
  test('GBP', () => {
    render(<composed.GBP />)
    const currencies = screen.getAllByText(/£/i)
    expect(currencies[0]).toBeInTheDocument()
    const amountText = currencies[0].textContent?.replace(/[^0-9.]/g, '')
    expect(amountText).toMatch(/^\d+(\.\d{2})?/)
  })
  test('Eur', () => {
    render(<composed.EUR />)
    const currencies = screen.getAllByText(/€/i)
    expect(currencies[0]).toBeInTheDocument()
    const amountText = currencies[0].textContent?.replace(/[^0-9.]/g, '')
    expect(amountText).toMatch(/^\d+(\.\d{2})?/)
  })
  test('Negative', () => {
    render(<composed.Negative />)
    const currencies = screen.getAllByText(/$/i)
    expect(currencies[0]).toBeInTheDocument()
    const negative = screen.getByText(/-/i)
    expect(negative).toBeInTheDocument()
    const amountText = currencies[0].textContent?.replace(/[^0-9.]/g, '')
    expect(amountText).toMatch(/^\d+(\.\d{2})?$/)
  })
})
