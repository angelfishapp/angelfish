import type { UseDroppableArguments } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import type { JSX } from 'react'

/**
 * Component we can use to wrap children instead of using `useDroppable` hook
 */
export const DropableComponent = (
  props: UseDroppableArguments & {
    children: (props: ReturnType<typeof useDroppable>) => JSX.Element
  },
) => {
  const { children, ...rest } = props

  const dropable = useDroppable({ ...rest })

  return children(dropable)
}
