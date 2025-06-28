import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import SaveIcon from '@mui/icons-material/Save'
import { Box, Button, FormLabel } from '@mui/material'
import CheckBox from '@mui/material/Checkbox'
import React, { type JSX } from 'react'

import { TagsField } from '@/components/forms/TagsField'
import { TextField } from '@/components/forms/TextField'
import type { ITag, ReconciledTransaction } from '@angelfish/core'

/**
 * Props for the TransactionEditForm component.
 */
interface TransactionEditFormProps {
  /** The transaction to edit */
  transaction: ReconciledTransaction

  /** Optional array of all available tags */
  allTags?: ITag[]

  /**
   * Callback function called when saving the form.
   * @param updates - Object containing updated note, tags, and reviewed status
   */
  onSave: (updates: { note?: string; tags?: Partial<ITag>[]; isReviewed?: boolean }) => void

  /** Callback function to close the form */
  onClose: () => void
}

/**
 * A form for editing a single transaction's note, tags, and review status.
 *
 * @param {TransactionEditFormProps} props - Component props
 * @returns {JSX.Element} The rendered component
 */
export default function TransactionEditForm({
  transaction,
  allTags = [],
  onSave,
  onClose,
}: TransactionEditFormProps): JSX.Element {
  const firstLineItem = transaction.line_items?.[0] || {}

  const [note, setNote] = React.useState(firstLineItem.note || '')
  const [tags, setTags] = React.useState<Partial<ITag>[]>(firstLineItem.tags || [])
  const [isReviewed, setIsReviewed] = React.useState(transaction.is_reviewed || false)

  /**
   * Handles saving the form and calling the `onSave` and `onClose` callbacks.
   */
  const handleSave = React.useCallback(() => {
    onSave({
      note,
      tags,
      isReviewed,
    })
    onClose()
  }, [note, tags, isReviewed, onSave, onClose])

  /**
   * Handles keyboard shortcuts:
   * - Esc to close
   * - Cmd/Ctrl + Enter to save
   *
   * @param {React.KeyboardEvent} e - The keyboard event
   */
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        handleSave()
      }
    },
    [onClose, handleSave],
  )

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: 'grey.50',
        borderTop: 1,
        borderColor: 'divider',
      }}
      onKeyDown={handleKeyDown}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '2fr 2fr 1fr auto',
          gap: 2,
          alignItems: 'start',
          minHeight: 60,
        }}
      >
        {/* Notes Field */}
        <Box>
          <FormLabel
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.primary',
              mb: 0.5,
              display: 'block',
            }}
          >
            Notes
          </FormLabel>
          <TextField
            margin="none"
            fullWidth
            placeholder="Add a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            size="small"
            autoFocus
          />
        </Box>

        {/* Tags Field */}
        <Box>
          <FormLabel
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.primary',
              mb: 0.5,
              display: 'block',
            }}
          >
            Tags
          </FormLabel>
          <TagsField
            margin="none"
            tags={allTags}
            fullWidth
            value={tags as ITag[]}
            onChange={(newTags) => setTags(newTags as ITag[])}
            size="small"
          />
        </Box>

        {/* Reviewed Field */}
        <Box>
          <FormLabel
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'text.primary',
              mb: 0.5,
              display: 'block',
            }}
          >
            Reviewed
          </FormLabel>
          <CheckBox
            color={isReviewed ? 'success' : undefined}
            icon={<CheckCircleOutlineIcon />}
            checked={isReviewed}
            checkedIcon={<CheckCircleIcon />}
            onChange={(e) => setIsReviewed(e.target.checked)}
          />
        </Box>

        {/* Save Button */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <FormLabel sx={{ fontSize: '0.875rem', opacity: 0 }}>Actions</FormLabel>
          <Button
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ minWidth: 80 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
