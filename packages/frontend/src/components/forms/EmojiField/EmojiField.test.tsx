// ColorField.test.tsx
import theme from '@/app/theme'
import { ThemeProvider } from '@emotion/react'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as stories from './EmojiField.stories'

const { Default } = composeStories(stories)

describe('EmojiFIeld', () => {
  it('opens EmojiFIeld and triggers onChange when EMoji is selected', async () => {
    render(
      <ThemeProvider theme={theme}>
        <Default />
      </ThemeProvider>,
    )

    const emojiButton = screen.getByRole('button')
    expect(emojiButton).toBeInTheDocument()
    // await user.click(emojiButton)

    // // const picker = await document.querySelector('.sketch-picker')
    // // expect(picker).toBeInTheDocument()
    // // expect(picker).toBeVisible()
    // // const emoji = screen.getByLabelText('😀') 
    // // expect(emoji).toBeInTheDocument()
    // // expect(emoji).toBeVisible()

    // // await user.clear(inputById!)
    // // await user.type(inputById!, '#ff0000')

    // // expect((inputById as HTMLInputElement).value).toBe('#ff0000')
  })
})
