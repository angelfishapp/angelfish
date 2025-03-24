import type React from 'react'
import type { EmojiProps } from './Emoji.interface'

import data from './apple.json'

/**
 * Emoji Component: Provides custom Emoji Mart Components to ensure they pick up the offline
 * sheets so Emoji's still work when user isn't connected to internet. If invalid emoji is passed
 * it will fallback to a question mark emoji.
 */
export function Emoji({ emoji, size, style }: EmojiProps) {
  // Handle no Emoji
  if (!emoji) return null

  let fallbackEmoji = emoji
  if (!(emoji in data.emojis)) {
    // Fallback to question mark if emoji not found
    fallbackEmoji = 'question'
  }

  // Get the emoji skin data from the JSON file
  const emojiSkin = (data.emojis as Record<string, (typeof data.emojis)[keyof typeof data.emojis]>)[
    fallbackEmoji
  ].skins[0]

  const spriteStyle: React.CSSProperties = {
    ...style,
    display: 'block',
    width: size,
    height: size,
    backgroundImage: `url(/assets/img/emojis/sheet_apple_64.png)`,
    backgroundSize: `${100 * data.sheet.cols}% ${100 * data.sheet.rows}%`,
    backgroundPosition: `${
      (100 / (data.sheet.cols - 1)) * emojiSkin.x
    }% ${(100 / (data.sheet.rows - 1)) * emojiSkin.y}%`,
  }

  return <span style={spriteStyle}></span>
}
