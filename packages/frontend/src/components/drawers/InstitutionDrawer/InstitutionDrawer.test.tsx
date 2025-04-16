import theme from '@/app/theme'
import { ThemeProvider } from '@mui/system'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import * as stories from './InstitutionDrawer.stories'

const { UpdateInstitution, AddNewInstitution } = composeStories(stories)

describe('BankAccount Drawer stories', () => {
  it('renders the UpdateBankAccount drawer', () => {
    render(
      <ThemeProvider theme={theme}>
        <UpdateInstitution />
      </ThemeProvider>,
    )
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

  it('renders the AddNewBankAccount drawer', () => {
    render(
      <ThemeProvider theme={theme}>
        <AddNewInstitution />
      </ThemeProvider>,
    )
    const drawer = screen.getByText('Add Institution')
    expect(drawer).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()

    const institutionField = screen.getByPlaceholderText('Type in Institution Name...')
    expect(institutionField).toBeInTheDocument()
    expect(institutionField).toHaveValue("")
    expect(screen.getByText('Name')).toBeInTheDocument()

    const countryField = screen.getByPlaceholderText('Search Countries...')
    expect(countryField).toBeInTheDocument()
    expect(countryField).toHaveValue('')

    const websiteField = screen.getByPlaceholderText('E.g. https://www.hsbc.com')
    expect(websiteField).toBeInTheDocument()
    expect(websiteField).toHaveValue("")

    const isInstitutuinOpenField = screen.getByRole('checkbox')
    expect(isInstitutuinOpenField).toBeInTheDocument()
    expect(isInstitutuinOpenField).toBeChecked()
  })
})
