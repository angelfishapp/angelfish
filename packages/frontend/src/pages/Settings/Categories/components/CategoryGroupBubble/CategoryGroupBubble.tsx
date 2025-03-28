import { Emoji } from '@/components/Emoji'
import type { CategoryGroupBubbleProps } from './CategoryGroupBubble.interface'
import {
  CategoryGroupButton,
  CategoryGroupCount,
  CategoryGroupIcon,
  CategoryGroupTitle,
  EditLabel,
} from './CategoryGroupBubble.styles'

/**
 * Displays Category Group Bubble on Category Settings Page
 */

export default function CategoryGroupBubble({
  categoryGroup,
  isSelected = false,
  onClick,
  onEdit,
}: CategoryGroupBubbleProps) {
  return (
    <CategoryGroupButton
      key={`category-income-${categoryGroup.id}`}
      selected={isSelected}
      onClick={onClick}
    >
      <CategoryGroupIcon>
        {categoryGroup.icon && <Emoji size={64} emoji={categoryGroup.icon} />}
      </CategoryGroupIcon>
      <CategoryGroupTitle>{categoryGroup.name}</CategoryGroupTitle>
      <CategoryGroupCount>{categoryGroup.total_categories ?? 0} Categories</CategoryGroupCount>
      {isSelected && (
        <EditLabel
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          Edit Group
        </EditLabel>
      )}
    </CategoryGroupButton>
  )
}
