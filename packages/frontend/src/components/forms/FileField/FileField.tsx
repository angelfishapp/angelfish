import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'

import { TextField } from '../TextField'
import type { FileFieldProps } from './FileField.interface'

/**
 * File Field Component to allow user to select a file or multiple files from the local file system.
 */
export default React.forwardRef<HTMLInputElement, FileFieldProps>(function FileField(
  {
    onChange,
    onOpenFileDialog,
    placeholder,
    fileTypes,
    multiple = false,
    value,
    ...formField
  }: FileFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  return (
    <div
      onClick={async () => {
        const files = await onOpenFileDialog?.(multiple, fileTypes)
        onChange?.(files)
      }}
    >
      <TextField
        inputRef={ref}
        placeholder={placeholder ? placeholder : multiple ? 'Select Files' : 'Select File'}
        value={value ? (multiple ? (value as string[]).join(', ') : value) : ''}
        slotProps={{
          input: {
            style: { minWidth: 300, cursor: 'pointer' },
            readOnly: true,
            endAdornment: (
              <InputAdornment component="label" position="end" style={{ cursor: 'pointer' }}>
                <FileUploadOutlined />
              </InputAdornment>
            ),
          },
        }}
        {...formField}
      />
    </div>
  )
})
