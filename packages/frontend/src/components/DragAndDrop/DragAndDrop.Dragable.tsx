import type { JSX } from 'react'
import type { UseDraggableArguments } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'

/**
 * Component we can use to wrap children instead of using `useDraggable` hook
 */
export const DragableComponent = (
  props: UseDraggableArguments & {
    children: (props: ReturnType<typeof useDraggable>) => JSX.Element
  },
) => {
  const { children, ...rest } = props

  const dragable = useDraggable({ ...rest })

  return children(dragable)
}
