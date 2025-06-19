import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as stories from './CategoryDrawer.stories'

const { UpdateCategoryGroup, AddNewCategoryGroup } = composeStories(stories)

describe('CategoryDrawer  stories', () => {
  it('renders the UpdateCategoryGroup drawer', async () => {
    render(<UpdateCategoryGroup />)
    await waitFor(() => {
      const drawer = screen.getByText('Edit Category')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('E.g. Landscaping')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toHaveValue(UpdateCategoryGroup?.args?.initialValue?.name)

      const descriptionField = screen.getByPlaceholderText(
        'E.g. Purchasing of materials, plants, or professional landscapers for your home garden.',
      )
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue(UpdateCategoryGroup?.args?.initialValue?.cat_description)

      const groupField = screen.getByPlaceholderText('Search Category Groups...')
      expect(groupField).toBeInTheDocument()
      expect(groupField).toHaveValue(UpdateCategoryGroup?.args?.categoryGroups?.[1]?.name ?? '')

      const TypeField = document.querySelector('#mui-component-select-type')
      expect(TypeField).toBeInTheDocument()
      expect(TypeField).toHaveTextContent('Optional')

      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeEnabled()
    })
  })

  it('renders the AddNewCategoryGroup drawer', async () => {
    render(<AddNewCategoryGroup />)
    await waitFor(() => {
      const drawer = screen.getByText('Create Category')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('E.g. Landscaping')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toHaveValue('Test Name')

      const descriptionField = screen.getByPlaceholderText(
        'E.g. Purchasing of materials, plants, or professional landscapers for your home garden.',
      )
      expect(descriptionField).toBeInTheDocument()
      expect(descriptionField).toHaveValue('')

      const groupField = screen.getByPlaceholderText('Search Category Groups...')
      expect(groupField).toBeInTheDocument()
      expect(groupField).toHaveValue('')

      const TypeField = document.querySelector('#mui-component-select-type')
      expect(TypeField).toBeInTheDocument()

      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeEnabled()
    })
  })
})
