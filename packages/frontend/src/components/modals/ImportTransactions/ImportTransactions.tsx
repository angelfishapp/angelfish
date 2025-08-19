import React from 'react'

import { Stepper } from '@/components/Stepper'
import { useTranslate } from '@/utils/i18n'
import type { ParsedFileMappings, ReconciledTransaction } from '@angelfish/core'
import ImportTransactionsConfirm from './components/Steps/ImportTransactions-Confirm'
import ImportTransactionsFile from './components/Steps/ImportTransactions-File'
import ImportTransactionsMapping from './components/Steps/ImportTransactions-Mapping'
import type { ImportTransactionsProps } from './ImportTransactions.interface'

/**
 * Import Transactions Modal
 */
export default function ImportTransactions({
  accountsWithRelations,
  defaultAccount,
  onClose,
  onOpenFileDialog,
  onGetFileMappings,
  onReconcileTransactions,
  onComplete,
  open = false,
}: ImportTransactionsProps) {
  const { ImportTransactions: t } = useTranslate('components.modals')
  const [file, setFile] = React.useState<string>('')
  const [fileMappings, setFileMappings] = React.useState<ParsedFileMappings | undefined>(undefined)
  const [transactions, setTransactions] = React.useState<ReconciledTransaction[] | undefined>(
    undefined,
  )
  const [activeStep, setActiveStep] = React.useState<number>(1)
  const [error, setError] = React.useState<string | undefined>(undefined)

  // Render
  return (
    <Stepper
      labels={[t['selectFile'], t['confirmMappings'], t['reviewTransactions']]}
      onClose={() => {
        // Reset to initial state
        setFile('')
        setError(undefined)
        setFileMappings(undefined)
        setTransactions(undefined)
        onClose?.()
      }}
      onTransitionEnd={() => {
        // Reset to first step
        setActiveStep(1)
        setError(undefined)
      }}
      open={open}
      activeStep={activeStep}
      displayBackdrop={true}
    >
      <ImportTransactionsFile
        accountsWithRelations={accountsWithRelations}
        defaultAccount={defaultAccount}
        error={error}
        onOpenFileDialog={onOpenFileDialog}
        onNext={(value, delimiter) => {
          setFile(value)
          setError(undefined)
          onGetFileMappings?.(value[0], delimiter)
            .then((parsedFileMappings) => {
              setFileMappings(parsedFileMappings)
              setActiveStep(2)
            })
            .catch((e) => {
              setError((e as Error).message || `${e}`)
            })
        }}
      />
      <ImportTransactionsMapping
        accountsWithRelations={accountsWithRelations}
        defaultAccount={defaultAccount}
        error={error}
        fileMappings={fileMappings}
        onNext={(mapper) => {
          setError(undefined)
          onReconcileTransactions?.(file[0], mapper)
            .then((reconciledTransactions) => {
              setTransactions(reconciledTransactions)
              setActiveStep(3)
            })
            .catch((e) => {
              setError((e as Error).message || `${e}`)
            })
        }}
      />
      <ImportTransactionsConfirm
        accountsWithRelations={accountsWithRelations}
        error={error}
        transactions={transactions}
        onCancel={() => {
          // Reset to initial state
          setFile('')
          setFileMappings(undefined)
          setTransactions(undefined)
          onClose?.()
        }}
        onNext={async (finalTransactions) => {
          try {
            setError(undefined)
            await onComplete(finalTransactions)
            // Reset to initial state
            setFile('')
            setFileMappings(undefined)
            setTransactions(undefined)
            onClose?.()
          } catch (e) {
            setError((e as Error).message || `${e}`)
          }
        }}
      />
    </Stepper>
  )
}
