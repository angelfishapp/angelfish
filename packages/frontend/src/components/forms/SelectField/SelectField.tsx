import React from 'react'

import { FormField } from '../FormField'
import type { SelectFieldProps } from './SelectField.interface'
import { StyledSelectField } from './SelectField.styles'

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
  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <StyledSelectField
        autoWidth={autoWidth}
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
      </StyledSelectField>
    </FormField>
  )
})
