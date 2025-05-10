import Picker from '@emoji-mart/react'
import React from 'react'

import type { EmojiPickerProps } from './EmojiPicker.interface'
import data from './apple.json'

/**
 * Emoji Picker Component
 */

// eslint-disable-next-line react/display-name
export const EmojiPicker = React.forwardRef(({ open = true, onSelect }: EmojiPickerProps, ref) => {
  // Render
  return open ? (
    <Picker
      ref={ref}
      data={data}
      set="apple"
      onEmojiSelect={(emoji: any) => onSelect?.(emoji.id as string)}
      previewEmoji="tropical_fish"
      skinTonePosition="none"
      maxFrequentRows={0}
      getSpritesheetURL={(set: string) => `/assets/img/emojis/sheet_${set}_64.png`}
    />
  ) : null
})
