import Select from '@mui/material/Select'
import React from 'react'

import { FormField } from '../FormField'
import type { SelectFieldProps } from './SelectField.interface'
import { useStyles } from './SelectField.styles'

/**
 * SelectField renders a Select dropdown for FormField
 */

export default React.forwardRef<HTMLDivElement, SelectFieldProps>(function SelectField(
  {
    autoWidth = false,
    children,
    defaultValue,
    IconComponent,
    multiple = false,
    name,
    onChange,
    onClose,
    onOpen,
    open,
    renderValue,
    value,
    ...formFieldProps
  }: SelectFieldProps,
  ref,
) {
  const classes = useStyles()

  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <Select
        autoWidth={autoWidth}
        className={classes.selectField}
        defaultValue={defaultValue}
        IconComponent={IconComponent}
        multiple={multiple}
        name={name}
        onChange={onChange}
        onClose={onClose}
        onOpen={onOpen}
        open={open}
        renderValue={renderValue}
        value={value}
        MenuProps={{
          /* Keep application scrollbar visible while mounted. */
          disableScrollLock: true,
        }}
      >
        {children}
      </Select>
    </FormField>
  )
})
