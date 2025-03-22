import ButtonBase from '@mui/material/ButtonBase'
import clsx from 'clsx'

import { Emoji } from '@/components/Emoji'
import type { CategoryGroupBubbleProps } from './CategoryGroupBubble.interface'
import { useStyles } from './CategoryGroupBubble.styles'

/**
 * Displays Category Group Bubble on Category Settings Page
 */

export default function CategoryGroupBubble({
  categoryGroup,
  isSelected = false,
  onClick,
  onEdit,
}: CategoryGroupBubbleProps) {
  const classes = useStyles()

  return (
    <ButtonBase
      key={`category-income-${categoryGroup.id}`}
      className={clsx(classes.categoryContainer, isSelected && classes.categoryContainerSelected)}
      onClick={onClick}
    >
      <div className={classes.categoryIcon}>
        {categoryGroup.icon && <Emoji size={64} emoji={categoryGroup.icon} />}
      </div>
      <div className={classes.categoryTitle}>{categoryGroup.name}</div>
      <div className={classes.categoryCount}>{categoryGroup.total_categories ?? 0} Categories</div>
      {isSelected && (
        <div
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
          className={classes.editLabel}
        >
          Edit Group
        </div>
      )}
    </ButtonBase>
  )
}
