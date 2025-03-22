import Box from '@mui/material/Box'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import IconButton from '@mui/material/IconButton'
import React from 'react'

import { Emoji, EmojiPicker } from '@/components/Emoji'
import { FormField } from '../FormField'
import type { EmojiFieldProps } from './EmojiField.interface'
import { useStyles } from './EmojiField.styles'

/**
 * Provides Emoji Picker Field to Select Icons on Forms
 */

export default React.forwardRef<HTMLDivElement, EmojiFieldProps>(function EmojiField(
  { defaultValue = 'question', onChange, value, ...formFieldProps }: EmojiFieldProps,
  ref,
) {
  const classes = useStyles()

  // Component State
  const [emoji, setEmoji] = React.useState<string | undefined>(value ? value : defaultValue)
  const [open, setOpen] = React.useState(false)

  /**
   * Handle Icon Button Click
   */
  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  /**
   * Handle Clicking Away
   */
  const handleClickAway = () => {
    setOpen(false)
  }

  /**
   * Make sure updating value updates field
   */
  React.useEffect(() => {
    setEmoji(value)
  }, [value])

  // Render
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <FormField ref={ref} {...formFieldProps}>
          <IconButton className={classes.emojiFieldIcon} onClick={handleClick} size="large">
            <Emoji emoji={emoji ? emoji : 'question'} size={32} />
          </IconButton>
          <EmojiPicker
            open={open}
            onSelect={(emoji: string) => {
              setEmoji(emoji)
              setOpen(false)
              if (onChange) {
                onChange(emoji)
              }
            }}
          />
        </FormField>
      </Box>
    </ClickAwayListener>
  )
})
