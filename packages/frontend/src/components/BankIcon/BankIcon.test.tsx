import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './BankIcon.stories' // Ensure correct path

const composed = composeStories(stories)

describe('BankIcon', () => {
  test('renders Chase bank icon', async () => {
    render(<composed.Chase />)
    const bankImage = screen.getAllByRole('img')[0]
    expect(bankImage).toBeInTheDocument()
    expect(bankImage).toHaveAttribute('src', `data:image/png;base64,${composed.Chase.args.logo}`)
  })

  test('renders Wells Fargo bank icon', async () => {
    render(<composed.WellsFargo />)

    const bankImage = screen.getAllByRole('img')[0]
    expect(bankImage).toBeInTheDocument()
    expect(bankImage).toHaveAttribute(
      'src',
      `data:image/png;base64,${composed.WellsFargo.args.logo}`,
    )
  })

  test('renders HSBC bank icon', async () => {
    render(<composed.HSBC />)
    const bankImage = screen.getAllByRole('img')[0]
    expect(bankImage).toBeInTheDocument()
    expect(bankImage).toHaveAttribute('src', `data:image/png;base64,${composed.HSBC.args.logo}`)
  })

  test('renders error message in Error story', () => {
    render(<composed.Error />)
    const bankImage = screen.getAllByRole('img')[0]
    expect(bankImage).toBeInTheDocument()
    expect(bankImage).toHaveAttribute('src', `data:image/png;base64,${composed.Error.args.logo}`)
  })

  test('renders placeholder or fallback when no logo is provided', () => {
    render(<composed.NoLogo />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const fallbackIcon = screen.getByTestId('AccountBalanceIcon');
    expect(fallbackIcon).toBeInTheDocument();
  })
})
