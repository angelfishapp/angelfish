import { composeStories } from '@storybook/react'
import { render, screen, waitFor } from '@testing-library/react'
import * as stories from './UserDrawer.stories'

const { UpdateUser, AddNewUser } = composeStories(stories)

describe('User Drawer stories', () => {
  it('renders the UpdateUser drawer', async () => {
    render(<UpdateUser />)
    await waitFor(() => {
      const drawer = screen.getByText('Edit User')
      expect(drawer).toBeInTheDocument()

      const FirstNameField = screen.getByPlaceholderText('First Name')
      expect(FirstNameField).toBeInTheDocument()
      expect(FirstNameField).toHaveValue(UpdateUser?.args?.initialValue?.first_name)

      const LastNameField = screen.getByPlaceholderText('Last Name')
      expect(LastNameField).toBeInTheDocument()
      expect(LastNameField).toHaveValue(UpdateUser?.args?.initialValue?.last_name)

      const emailField = screen.getByPlaceholderText('Email')
      expect(emailField).toBeInTheDocument()
      expect(emailField).toHaveValue(UpdateUser?.args?.initialValue?.email)

      const phoneField = screen.getByRole('textbox', { name: /phone/i })
      expect(phoneField).toBeInTheDocument()
      expect(phoneField).toHaveValue('+41 53 333 33 3 ')

      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeEnabled()
    })
  })

  it('renders the AddNewUser drawer', async () => {
    render(<AddNewUser />)
    await waitFor(() => {
      const drawer = screen.getByText('Add User')
      expect(drawer).toBeInTheDocument()

      const FirstNameField = screen.getByPlaceholderText('First Name')
      expect(FirstNameField).toBeInTheDocument()
      expect(FirstNameField).toHaveValue('')

      const LastNameField = screen.getByPlaceholderText('Last Name')
      expect(LastNameField).toBeInTheDocument()
      expect(LastNameField).toHaveValue('')

      const emailField = screen.getByPlaceholderText('Email')
      expect(emailField).toBeInTheDocument()
      expect(emailField).toHaveValue('')

      const phoneField = screen.getByRole('textbox', { name: /phone/i })
      expect(phoneField).toBeInTheDocument()
      expect(phoneField).toHaveValue('+                   ')

      const saveButton = screen.getByText('Save')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).not.toBeEnabled()
    })
  })
})
