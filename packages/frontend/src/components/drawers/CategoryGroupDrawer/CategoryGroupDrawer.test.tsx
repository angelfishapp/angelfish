import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './CategoryGroupDrawer.stories'

const { UpdateCategoryGroup, AddNewCategoryGroup } = composeStories(stories)

describe('CategoryDrawer  stories', () => {
  it('renders the UpdateCategoryGroup drawer', () => {
    render(
      <ThemeProvider theme={theme}>
        <UpdateCategoryGroup />
      </ThemeProvider>,
    )
    const drawer = screen.getByText('Edit Category Group')
    expect(drawer).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()

    const nameField = screen.getByPlaceholderText('E.g. Household')
    expect(nameField).toBeInTheDocument()
    expect(nameField).toHaveValue(UpdateCategoryGroup?.args?.categoryGroup?.name)

    const descriptionField = screen.getByPlaceholderText(
      'E.g. All categories regarding household Expenses.',
    )
    expect(descriptionField).toBeInTheDocument()
    expect(descriptionField).toHaveValue(UpdateCategoryGroup?.args?.categoryGroup?.description)

    const TypeField = document.querySelector('#mui-component-select-type')
    expect(TypeField).toBeInTheDocument()
    expect(TypeField).toHaveTextContent(UpdateCategoryGroup?.args?.categoryGroup?.type ?? '')

    const saveButton = screen.getByText('Save')
    expect(saveButton).toBeInTheDocument()
    expect(saveButton).not.toBeEnabled()
  })

  it('renders the AddNewCategoryGroup drawer', () => {
    render(
      <ThemeProvider theme={theme}>
        <AddNewCategoryGroup />
      </ThemeProvider>,
    )
    const drawer = screen.getByText('Create Category Group')
    expect(drawer).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()

    const nameField = screen.getByPlaceholderText('E.g. Household')
    expect(nameField).toBeInTheDocument()
    expect(nameField).toHaveValue('')

    const descriptionField = screen.getByPlaceholderText(
      'E.g. All categories regarding household Expenses.',
    )
    expect(descriptionField).toBeInTheDocument()
    expect(descriptionField).toHaveValue('')

    const TypeField = document.querySelector('#mui-component-select-type')
    expect(TypeField).toBeInTheDocument()

    const saveButton = screen.getByText('Save')
    expect(saveButton).toBeInTheDocument()
    expect(saveButton).not.toBeEnabled()
  })
})
