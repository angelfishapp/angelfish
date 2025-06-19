import theme from '@/app/theme'
import type { ITag } from '@angelfish/core'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './MultiSelectField.stories'

const { Categories, Tags } = composeStories(stories)

describe('renders MultiSelectField Story', () => {
  test('render of Catergories Story', async () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <Categories />
      </ThemeProvider>,
    )
    const { label, placeholder } = Categories.args
    const [title] = screen.getAllByText(label as string)
    expect(title).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(placeholder as string)
    expect(textBox).toBeInTheDocument()
    fireEvent.change(textBox, { target: { value: 'cleaning' } })
    fireEvent.keyDown(textBox, { key: 'Enter', code: 'Enter', charCode: 13 })

    const textBoxWithValue = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(textBoxWithValue).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })

    expect(textBox).toBeInTheDocument()
  })

  test('render of Tags Story', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Tags />
      </ThemeProvider>,
    )
    const { label, placeholder, options } = Tags.args
    const tags = options as ITag[]
    const [title] = screen.getAllByText(label as string)
    expect(title).toBeInTheDocument()
    expect(screen.getByText(tags[0].name)).toBeInTheDocument()

    const textBox = screen.getByPlaceholderText(placeholder as string)
    expect(textBox).toBeInTheDocument()
  })
})
