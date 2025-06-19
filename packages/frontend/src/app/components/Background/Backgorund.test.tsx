import { composeStories } from '@storybook/react'
import { render } from '@testing-library/react'

import * as stories from './Background.stories'

const { LandDay, SubmergedEvening } = composeStories(stories)

describe('Background component tests', () => {
  it('renders PrimaryBackground without crashing', () => {
    const { container } = render(<LandDay />)
    expect(container.querySelector('.land_bg_water')).toBeInTheDocument()
    expect(container.querySelector('.login_splash')).toBeInTheDocument()
    expect(container.querySelector('.water-shimmer')).toBeInTheDocument()
    expect(container.querySelector('.mountains_left')).toBeInTheDocument()
    expect(container.querySelector('.mountains_right')).toBeInTheDocument()
    expect(container.querySelector('.underwater_bg')).toBeInTheDocument()
  })

  it('renders SubmergedEvening without crashing', () => {
    const { container } = render(<SubmergedEvening />)
    expect(container.querySelector('.underwater_bg')).toBeInTheDocument()
    expect(container.querySelector('.aquarium')).toBeInTheDocument()
    expect(container.querySelector('.water-shimmer')).toBeInTheDocument()
  })
})
