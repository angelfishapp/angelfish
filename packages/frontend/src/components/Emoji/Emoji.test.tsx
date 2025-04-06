import { composeStories } from '@storybook/react'
import { render } from '@testing-library/react'
import * as stories from './Emoji.stories'

const { Default, InvalidEmoji } = composeStories(stories)
// to-check both stories is the same I didn't specify a test since the prop is the same for all cases  
describe('Emoji stories', () => {
  it('renders the default Emoji story', () => {
    const { container } = render(<Default />)
    const emojiSpan = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(emojiSpan).toBeInTheDocument()
    expect(emojiSpan).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })
  })
  it('renders the default Emoji story', () => {
    const { container } = render(<InvalidEmoji />)
    const emojiSpan = container.querySelector('span[style*="sheet_apple_64.png"]')
    expect(emojiSpan).toBeInTheDocument()
    expect(emojiSpan).toHaveStyle({
      backgroundImage: 'url("/assets/img/emojis/sheet_apple_64.png")',
    })
  })
})
