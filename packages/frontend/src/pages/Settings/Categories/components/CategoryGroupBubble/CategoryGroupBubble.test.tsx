import type { ICategoryGroup } from '@angelfish/core'
import { composeStories } from '@storybook/react'
import { fireEvent, render, screen } from '@testing-library/react'
import * as stories from './CategoryGroupBubble.stories'

const { Default } = composeStories(stories)

describe('CategoryGroupBubble', () => {
  it('renders the default category group bubble correctly', () => {
    render(<Default />)
    const categoryGroup = Default.args.categoryGroup as ICategoryGroup

    expect(screen.getByText(categoryGroup.name)).toBeInTheDocument()
    expect(screen.getByText(`${categoryGroup.total_categories} Categories`)).toBeInTheDocument()
    expect(screen.queryByText('Edit Group')).not.toBeInTheDocument()
  })

  it('calls onClick when the category group bubble is clicked', () => {
    const onClickMock = vi.fn()
    render(<Default onClick={onClickMock} />)

    fireEvent.click(screen.getByRole('button'))
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })
})
