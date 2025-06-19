import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as stories from './InstitutionDrawer.stories'

const { UpdateInstitution, AddNewInstitution } = composeStories(stories)

describe('Insition  Drawer stories', () => {
  it('renders the UpdateBankAccount drawer', async () => {
    render(<UpdateInstitution />)
    await waitFor(() => {
      const drawer = screen.getByText('Edit Institituion')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()

      const institutionField = screen.getByPlaceholderText('Type in Institution Name...')
      expect(institutionField).toBeInTheDocument()
      expect(institutionField).toHaveValue(UpdateInstitution?.args?.initialValue?.name)
      expect(screen.getByText('Name')).toBeInTheDocument()

      const countryField = screen.getByPlaceholderText('Search Countries...')
      expect(countryField).toBeInTheDocument()
      expect(countryField).toHaveValue('United States')

      const websiteField = screen.getByPlaceholderText('E.g. https://www.hsbc.com')
      expect(websiteField).toBeInTheDocument()
      expect(websiteField).toHaveValue(UpdateInstitution?.args?.initialValue?.url)

      const isInstitutuinOpenField = screen.getByRole('checkbox')
      expect(isInstitutuinOpenField).toBeInTheDocument()
      expect(isInstitutuinOpenField).toBeChecked()
    })
  })

  it('renders the AddNewBankInstitution drawer', async () => {
    render(<AddNewInstitution />)
    await waitFor(() => {
      const drawer = screen.getByText('Add Institution')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Name')).toBeInTheDocument()

      const institutionField = screen.getByPlaceholderText('Type in Institution Name...')
      expect(institutionField).toBeInTheDocument()
      expect(institutionField).toHaveValue('')
      expect(screen.getByText('Name')).toBeInTheDocument()

      const countryField = screen.getByPlaceholderText('Search Countries...')
      expect(countryField).toBeInTheDocument()
      expect(countryField).toHaveValue('')

      const websiteField = screen.getByPlaceholderText('E.g. https://www.hsbc.com')
      expect(websiteField).toBeInTheDocument()
      expect(websiteField).toHaveValue('')

      const isInstitutuinOpenField = screen.getByRole('checkbox')
      expect(isInstitutuinOpenField).toBeInTheDocument()
      expect(isInstitutuinOpenField).toBeChecked()
    })
  })
})
