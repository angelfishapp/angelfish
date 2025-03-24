import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Popover from '@mui/material/Popover'
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
  const [emojiAnchorEl, setEmojiAnchorEl] = React.useState<HTMLElement | null>(null)

  /**
   * Make sure updating value updates field
   */
  React.useEffect(() => {
    setEmoji(value)
  }, [value])

  // Render
  return (
    <Box sx={{ position: 'relative' }}>
      <FormField ref={ref} {...formFieldProps}>
        <IconButton
          className={classes.emojiFieldIcon}
          onClick={(e) => setEmojiAnchorEl(e.currentTarget)}
          size="large"
        >
          <Emoji emoji={emoji ? emoji : 'question'} size={32} />
        </IconButton>
        <Popover
          open={Boolean(emojiAnchorEl)}
          disableScrollLock
          disablePortal
          onClose={() => setEmojiAnchorEl(null)}
          {...{ anchorEl: emojiAnchorEl }}
        >
          <EmojiPicker
            open={Boolean(emojiAnchorEl)}
            onSelect={(emoji: string) => {
              setEmoji(emoji)
              setEmojiAnchorEl(null)
              if (onChange) {
                onChange(emoji)
              }
            }}
          />
        </Popover>
      </FormField>
    </Box>
  )
})
