import PersonIcon from '@mui/icons-material/Person'
import MuiAvatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import type { AvatarProps } from './Avatar.interface'

/**
 * Displays user Avatar if set, otherwise will show their initials.
 * If no user will display fallback icon
 */
export default function Avatar({
  avatar,
  firstName,
  lastName,
  Icon = PersonIcon,
  size = 40,
  className,
  displayBorder = false,
}: AvatarProps) {
  // If name is provided, show full avatar
  if (firstName && lastName) {
    return (
      // Full Avatar
      <Tooltip title={firstName + ' ' + lastName}>
        <MuiAvatar
          alt={firstName + ' ' + lastName}
          src={avatar ? `data:image/png;base64, ${avatar}` : undefined}
          className={className}
          sx={{
            width: size,
            height: size,
            border: displayBorder ? '1px solid !important' : 'none !important',
            borderColor: (theme) => theme.palette.primary.main,
            fontSize: size > 25 ? size - 25 : undefined,
            backgroundColor: (theme) =>
              avatar ? theme.palette.common.white : theme.palette.secondary.main,
          }}
        >
          {firstName[0].toUpperCase() + lastName[0].toUpperCase()}
        </MuiAvatar>
      </Tooltip>
    )
  } else if (avatar) {
    // Avatar provided but no name
    return (
      <MuiAvatar
        alt="Avatar"
        src={`data:image/png;base64, ${avatar}`}
        className={className}
        sx={{
          width: size,
          height: size,
          border: displayBorder ? '1px solid !important' : 'none !important',
          borderColor: (theme) => theme.palette.primary.main,
          backgroundColor: (theme) => theme.palette.common.white,
        }}
      />
    )
  }

  // No user loaded
  return (
    <MuiAvatar
      className={className}
      sx={{
        width: size,
        height: size,
        border: displayBorder ? '1px solid !important' : 'none !important',
        borderColor: (theme) => theme.palette.primary.main,
        backgroundColor: (theme) => theme.palette.secondary.main,
      }}
    >
      <Icon
        sx={{
          userSelect: 'none',
          fontSize: '1.5rem',
          width: '75%',
          height: '75%',
        }}
      />
    </MuiAvatar>
  )
}
