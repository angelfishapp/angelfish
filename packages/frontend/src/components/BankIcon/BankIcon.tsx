import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import Badge from '@mui/material/Badge'
import CircularProgress from '@mui/material/CircularProgress'
import Tooltip from '@mui/material/Tooltip'

import type { BankIconProps } from './BankIcon.interface'

/**
 * Main Component
 */
export default function BankIcon({ error, isSyncing = false, logo, size = 50 }: BankIconProps) {
  return (
    <Badge
      color="error"
      badgeContent={
        <Tooltip title={error ? error : ' '} placement="right-start">
          <span>!</span>
        </Tooltip>
      }
      overlap="circular"
      invisible={error ? false : true}
      sx={{
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          borderRadius: '50%',
          boxShadow: '0 3px 10px rgba(0,0,0,0.25)',
          width: size,
          height: size,
          overflow: 'hidden',
          backgroundColor: '#FFF',
        }}
      >
        {logo ? (
          <img
            style={{
              width: '100%',
              height: '100%',
            }}
            src={'data:image/png;base64,' + logo}
          />
        ) : (
          <AccountBalanceIcon
            style={{
              width: '100%',
              height: '85%',
            }}
          />
        )}
        {isSyncing && (
          <CircularProgress
            style={{
              marginLeft: size * -1,
            }}
            size={size - 10}
          />
        )}
      </div>
    </Badge>
  )
}
