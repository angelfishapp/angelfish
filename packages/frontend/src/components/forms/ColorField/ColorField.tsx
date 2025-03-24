import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
import React from 'react'
import type { ColorResult } from 'react-color'
import { SketchPicker } from 'react-color'

import { FormField } from '../FormField'
import type { ColorFieldProps } from './ColorField.interface'
import { useStyles } from './ColorField.styles'

/**
 * Provides Color Picker Field to Select a Color on Forms. Will return HEX color
 * value onChange.
 */

export default React.forwardRef<HTMLDivElement, ColorFieldProps>(function ColorField(
  { defaultValue = '#FFFFFF', onChange, value, ...formFieldProps }: ColorFieldProps,
  ref,
) {
  // Component State
  const [color, setColor] = React.useState<string>(value ? value : defaultValue)
  const [colorAnchorEl, setColorAnchorEl] = React.useState<HTMLElement | null>(null)

  const classes = useStyles({ colorValue: color })

  /**
   * Make sure updating value updates field
   */
  React.useEffect(() => {
    setColor(value ?? '')
  }, [value])

  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <IconButton
        className={classes.colorField}
        onClick={(e) => setColorAnchorEl(e.currentTarget)}
        size="large"
      >
        <div></div>
      </IconButton>
      <Popover
        open={Boolean(colorAnchorEl)}
        disableScrollLock
        disablePortal
        onClose={() => setColorAnchorEl(null)}
        {...{ anchorEl: colorAnchorEl }}
      >
        <SketchPicker
          color={color}
          onChange={(color: ColorResult) => {
            setColor(color.hex)
            if (onChange) {
              onChange(color.hex)
            }
          }}
        />
      </Popover>
    </FormField>
  )
})
