import Typeography from '@mui/material/Typography'
import clsx from 'clsx'

import { BankIcon } from '@/components/BankIcon'
import { Emoji } from '@/components/Emoji'
import type { CategoryLabelProps } from './CategoryLabel.interface'

/**
 * CategoryLabel Component: Renders a formated category from an Account. If
 * class is `CATEGORY` will render with Emoji/Category Group, if class is
 * `ACCOUNT` will render with institution logo/name in format:
 *
 * 		<Icon/Logo> <Group/Institution> > <Name>
 *
 * If account is null, will render `Unclassified`
 */

export default function CategoryLabel({ account, className, iconSize = 24 }: CategoryLabelProps) {
  if (!account) {
    return (
      <Typeography className={className}>
        <em>Unclassified</em>
      </Typeography>
    )
  }

  const Icon =
    account.class == 'ACCOUNT' ? (
      <BankIcon logo={account.institution?.logo} size={iconSize} />
    ) : (
      <Emoji size={iconSize} emoji={account.cat_icon ?? ''} />
    )
  const group = account.class == 'ACCOUNT' ? account.institution?.name : account.categoryGroup?.name

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {Icon}
      <Typeography noWrap className={className}>
        <span
          className={clsx('category-group', 'MuiTypography-colorTextSecondary')}
          style={{ marginLeft: 5 }}
        >
          {group}
        </span>{' '}
        &gt; <span className="category-name">{account.name}</span>
      </Typeography>
    </div>
  )
}
