import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as stories from './BankAccountDrawer.stories'

const { UpdateBankAccount, AddNewBankAccount } = composeStories(stories)

describe('BankAccount Drawer stories', () => {
  it('renders the UpdateBankAccount drawer', async () => {
    render(<UpdateBankAccount />)
    await waitFor(() => {
      const drawer = screen.getByText('Edit Bank Account')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Institution')).toBeInTheDocument()

      const institutionField = screen.getByPlaceholderText('Search Institutions...')
      expect(institutionField).toBeInTheDocument()
      expect(institutionField).toHaveValue(UpdateBankAccount?.args?.initialValue?.institution?.name)
      expect(screen.getByText('Name')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('E.g. HSBC Current Account')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toHaveValue(UpdateBankAccount?.args?.initialValue?.name)

      const accountTypeField = screen.getByPlaceholderText('Search Account Types...')
      expect(accountTypeField).toBeInTheDocument()
      expect(accountTypeField).toHaveValue(UpdateBankAccount?.args?.initialValue?.name)

      const accountOwners = document.querySelector('#user-field')
      expect(accountOwners).toBeInTheDocument()

      const searchCurrenciesField = screen.getByPlaceholderText('Search Currencies...')
      expect(searchCurrenciesField).toBeInTheDocument()
      expect(searchCurrenciesField).toHaveValue('United States Dollar (USD)')

      const startBalnceField = document.querySelector('input[name="start_balance"]')
      expect(startBalnceField).toBeInTheDocument()
      expect(startBalnceField).toHaveValue(
        UpdateBankAccount?.args?.initialValue?.acc_start_balance?.toFixed(2).toString(),
      )

      const accountLimitField = document.querySelector('input[name="account_limit"]')
      expect(accountLimitField).toBeInTheDocument()
      expect(accountLimitField).toHaveValue(
        UpdateBankAccount?.args?.initialValue?.acc_limit?.toFixed(2).toString(),
      )

      const isAccountOpenField = screen.getByRole('checkbox')
      expect(isAccountOpenField).toBeInTheDocument()
      expect(isAccountOpenField).toBeChecked()
    })
  })

  it('renders the AddNewBankAccount drawer', async () => {
    render(<AddNewBankAccount />)
    await waitFor(() => {
      const drawer = screen.getByText('Add New Bank Account')
      expect(drawer).toBeInTheDocument()
      expect(screen.getByText('Institution')).toBeInTheDocument()

      const institutionField = screen.getByPlaceholderText('Search Institutions...')
      expect(institutionField).toBeInTheDocument()
      expect(institutionField).toHaveValue('')
      expect(screen.getByText('Name')).toBeInTheDocument()

      const nameField = screen.getByPlaceholderText('E.g. HSBC Current Account')
      expect(nameField).toBeInTheDocument()
      expect(nameField).toHaveValue('')

      const accountTypeField = screen.getByPlaceholderText('Search Account Types...')
      expect(accountTypeField).toBeInTheDocument()
      expect(accountTypeField).toHaveValue('')

      const accountOwners = document.querySelector('#user-field')
      expect(accountOwners).toBeInTheDocument()

      const searchCurrenciesField = screen.getByPlaceholderText('Search Currencies...')
      expect(searchCurrenciesField).toBeInTheDocument()
      expect(searchCurrenciesField).toHaveValue('')

      const startBalnceField = document.querySelector('input[name="start_balance"]')
      expect(startBalnceField).toBeInTheDocument()
      expect(startBalnceField).toHaveValue('')

      const accountLimitField = document.querySelector('input[name="account_limit"]')
      expect(accountLimitField).toBeInTheDocument()
      expect(accountLimitField).toHaveValue('')

      const isAccountOpenField = screen.getByRole('checkbox')
      expect(isAccountOpenField).toBeInTheDocument()
      expect(isAccountOpenField).toBeChecked()
    })
  })
})
