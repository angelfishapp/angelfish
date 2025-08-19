import { Emoji } from '@/components/Emoji'
import { useTranslate } from '@/utils/i18n'
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
  const { settings: t } = useTranslate('pages')
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
      <CategoryGroupCount>
        {categoryGroup.total_categories ?? 0} {t['Categories']}
      </CategoryGroupCount>
      {isSelected && (
        <EditLabel
          onClick={(event) => {
            event.stopPropagation()
            onEdit()
          }}
        >
          {t['Edit Group']}
        </EditLabel>
      )}
    </CategoryGroupButton>
  )
}
