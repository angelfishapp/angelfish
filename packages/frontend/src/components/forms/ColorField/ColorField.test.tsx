// ColorField.test.tsx
import { ThemeProvider } from '@emotion/react'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './ColorField.stories'
import theme from '@/app/theme'

const { Default } = composeStories(stories)

describe('ColorField', () => {
  it('opens color picker and triggers onChange when color is selected', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const colorButton = screen.getByRole('button')
    await user.click(colorButton)

    const picker = await document.querySelector('.sketch-picker')
    expect(picker).toBeInTheDocument()
    expect(picker).toBeVisible()
    const inputById = document.getElementById('rc-editable-input-1')
    expect(inputById).toBeInTheDocument()

    await user.clear(inputById!)
    await user.type(inputById!, '#ff0000')
    
    expect((inputById as HTMLInputElement).value).toBe('#ff0000')

  })
})
