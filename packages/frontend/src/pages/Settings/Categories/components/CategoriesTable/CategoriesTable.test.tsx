import type { IAccount } from '@angelfish/core'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './CategoriesTable.stories'

const { FilteredToHomeGroup, NoCategories, AllCategories } = composeStories(stories)

describe('CategoriesTable', () => {
  it('renders filtered categories correctly', () => {
    render(<FilteredToHomeGroup />)
    const categories = FilteredToHomeGroup?.args.categories as IAccount[]
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(categories.length + 1)
  })

  it('renders empty state when no categories are provided', () => {
    render(<NoCategories />)
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.queryAllByRole('row')).toHaveLength(2)
  })

  it('renders all categories correctly', () => {
    const categories = AllCategories?.args.categories as IAccount[]
    render(<AllCategories />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Type')).toBeInTheDocument()
    expect(screen.getAllByRole('row')).toHaveLength(categories.length + 1)
  })
})
