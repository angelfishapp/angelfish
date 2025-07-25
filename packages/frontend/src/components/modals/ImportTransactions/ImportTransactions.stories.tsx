import Button from '@mui/material/Button'
import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import type { ImportFileType } from '@angelfish/core'
import { ImportTransactions } from '.'

// Mock Data
import {
  getAccountsWithRelations,
  getBankAccountsWithRelations,
  reconciledTransactions,
  tags,
} from '@angelfish/tests/fixtures'

const meta = {
  title: 'Components/modals/Import Transactions',
  component: ImportTransactions,
  args: {
    accountsWithRelations: getAccountsWithRelations(),
    defaultAccount: getBankAccountsWithRelations()[3],
    onOpenFileDialog: async (multiple: boolean, fileTypes?: string[]) => {
      const files = await new Promise<FileList | null>((resolve) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.multiple = multiple
        if (fileTypes) {
          input.accept = fileTypes.join(',')
        }
        input.onchange = () => {
          resolve(input.files)
        }
        input.click()
      })

      // Convert FileList to string[] or string
      if (files) {
        const fileArray = Array.from(files)
        if (multiple) {
          return fileArray.map((file) => file.name)
        }
        return fileArray[0].name
      }

      return null
    },
    onGetFileMappings: async (file, delimiter) => {
      action('onGetFileMappings')(file, delimiter)
      return {
        fileType: file.split('.').slice(-1)[0].toLowerCase() as ImportFileType,
        accounts: [
          { id: '1', name: 'Checking Account' },
          { id: '2', name: 'Savings Account' },
        ],
        categories: [
          'Bank Charges:Interest Paid',
          'Bank Charges:Service Charges',
          'Car Expenses',
          'Car:Purchase',
          'Food:Dining Out',
          'Home:Rent',
          'Investment Income:Interest',
          'Leisure & Entertainment:Movie Rentals',
          'Taxes:Income Tax',
          'Wages & Salary:Gross Pay',
          '[Acme Bank Checking]',
          '[Acme Joint Savings]',
          '[Acme Personal Checking]',
          '[Checking Account]',
          '[Savings Account]',
        ],
        csvHeaders: [
          {
            header: 'Date',
            samples: ['02/01/2021', '03/01/2021', '04/01/2021', '05/01/2021', '06/01/2021'],
          },
          {
            header: 'Name',
            samples: [
              'Transaction 1',
              'Transaction 2',
              'Transaction 3',
              'Transaction 4',
              'Transaction 5',
            ],
          },
          {
            header: 'Amount',
            samples: ['232.22', '4343.22', '222.22', '232.44', '544.33'],
          },
        ],
      }
    },
    onReconcileTransactions: async (file, mapper?) => {
      action('onReconcileTransactions')(file, mapper)
      return reconciledTransactions
    },
    onComplete: async (value) => {
      action('onComplete')(value)
    },
  },
  render: ({ onComplete, ...args }) => {
    const RenderComponent = () => {
      const [open, setOpen] = React.useState<boolean>(false)

      return (
        <>
          <Button onClick={() => setOpen(true)}>Import Transactions</Button>
          <ImportTransactions
            open={open}
            tags={tags}
            onClose={() => setOpen(false)}
            onComplete={async (value) => {
              setOpen(false)
              onComplete?.(value)
            }}
            {...args}
          />
        </>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof ImportTransactions>
export default meta

type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {},
}
