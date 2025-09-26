import FileUploadOutlined from '@mui/icons-material/FileUploadOutlined'
import InputAdornment from '@mui/material/InputAdornment'
import React from 'react'

import { TextField } from '../TextField'
import type { FileFieldProps } from './FileField.interface'
import ImageFileField from './components/ImageFileField'

/**
 * File Field Component to allow user to select a file or multiple files from the local file system.
 */

interface ExtendedFileFieldProps extends FileFieldProps {
  onImageProcess?: (data: any, files: File[]) => void
}

export default React.forwardRef<HTMLInputElement, FileFieldProps>(function FileField(
  {
    onChange,
    onOpenFileDialog,
    placeholder,
    fileTypes,
    multiple = false,
    value,
    variant = 'default',
    onImageProcess,
    ...formField
  }: ExtendedFileFieldProps,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  // Image variant uses the separate component
  if (variant === 'dropzone') {
    return (
      <ImageFileField
        onChange={onChange}
        onOpenFileDialog={onOpenFileDialog}
        fileTypes={fileTypes}
        multiple={multiple}
        value={value}
        onImageProcess={onImageProcess}
      />
    )
  }

  // Default variant (original functionality)
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
