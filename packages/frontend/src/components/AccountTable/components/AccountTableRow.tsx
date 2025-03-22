import CreditCardIcon from '@mui/icons-material/CreditCard'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import LocalAtmIcon from '@mui/icons-material/LocalAtm'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AvatarGroup from '@mui/material/AvatarGroup'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import { Avatar } from '@/components/Avatar'
import { BankIcon } from '@/components/BankIcon'
import { CurrencyLabel } from '@/components/CurrencyLabel'
import type { IInstitution } from '@angelfish/core'
import { getAccountTypeLabel, getCurrencyFromCode } from '@angelfish/core'
import type { AccountTableRowProps } from './AccountTableRow.interface'
import { StyledListItemButton } from './AccountTableRow.styles'

/**
 * AccountTableRow Component
 */
export default function AccountTableRow({
  book_default_currency,
  groupBy,
  row,
  selectedAccountId,
  onCreateAccount,
  onEditAccount,
  onEditInstitution,
  onSelectAccount,
}: AccountTableRowProps) {
  // Render Grouping Rows
  switch (row.groupingColumnId) {
    case 'acc_institution_id': {
      return (
        <ListItem
          data-row={`institution-${row.original.acc_institution_id}`}
          onDoubleClick={() => onEditInstitution(row.original.acc_institution as IInstitution)}
          sx={{
            backgroundColor: (theme) => theme.palette.grey[100],
            borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
            fontWeight: 'bold',
            '& .currency-label': !row.original.acc_institution?.is_open ? { opacity: 0.6 } : {},
          }}
        >
          <ListItemIcon sx={!row.original.acc_institution?.is_open ? { opacity: 0.6 } : undefined}>
            <BankIcon logo={row.original.acc_institution?.logo} />
          </ListItemIcon>
          <ListItemText
            primary={`${row.original.acc_institution?.name} ${
              !row.original.acc_institution?.is_open ? '(Closed)' : ''
            }`}
            primaryTypographyProps={{
              noWrap: true,
              fontWeight: 'bold',
              width: '98%',
              sx: !row.original.acc_institution?.is_open ? { opacity: 0.6 } : undefined,
            }}
            secondary={row.original.acc_country?.name}
            secondaryTypographyProps={{
              noWrap: true,
              sx: !row.original.acc_institution?.is_open ? { opacity: 0.6 } : undefined,
            }}
          />
          {/* TODO - Institutions can have accounts with different currencies so need to convert to the institutions currency when summing balances */}
          <CurrencyLabel
            className="currency-label"
            value={row.getValue('current_balance')}
            currency={row.original.acc_country?.currency}
          />
        </ListItem>
      )
    }
    case 'acc_owners': {
      return (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
            backgroundColor: (theme) => theme.palette.grey[200],
            fontWeight: 'bold',
          }}
        >
          <ListItemIcon>
            <AvatarGroup max={3} sx={{ marginRight: 1 }}>
              {row.original.acc_owner_users?.map((owner) => (
                <Avatar
                  key={owner.id}
                  avatar={owner.avatar}
                  firstName={owner.first_name}
                  lastName={owner.last_name}
                  size={40}
                  displayBorder={true}
                />
              ))}
            </AvatarGroup>
          </ListItemIcon>
          <ListItemText
            primary={row.original.acc_owners}
            primaryTypographyProps={{ noWrap: true, fontWeight: 'bold', width: '98%' }}
          />
          <CurrencyLabel
            value={row.getValue('local_current_balance')}
            currency={book_default_currency}
          />
        </ListItem>
      )
    }
    case 'acc_type': {
      return (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
            backgroundColor: (theme) => theme.palette.grey[200],
            fontWeight: 'bold',
          }}
        >
          <ListItemIcon>
            {(() => {
              switch (row.original.acc_type.type) {
                case 'depository':
                  return <LocalAtmIcon fontSize="large" htmlColor="#000" />
                case 'credit':
                  return <CreditCardIcon fontSize="large" htmlColor="#000" />
                case 'loan':
                  return <CreditScoreIcon fontSize="large" htmlColor="#000" />
                case 'investment':
                  return <ShowChartIcon fontSize="large" htmlColor="#000" />
                default:
                  return <QuestionMarkIcon fontSize="large" htmlColor="#000" />
              }
            })()}
          </ListItemIcon>
          <ListItemText
            primary={getAccountTypeLabel(row.original.acc_type.type)}
            primaryTypographyProps={{ noWrap: true, fontWeight: 'bold', width: '98%' }}
          />
          <CurrencyLabel
            value={row.getValue('local_current_balance')}
            currency={book_default_currency}
          />
        </ListItem>
      )
    }
    case 'acc_country': {
      return (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
            backgroundColor: (theme) => theme.palette.grey[200],
            fontWeight: 'bold',
          }}
        >
          <ListItemIcon>
            <img
              src={'/assets/svg/flags/4x3/' + row.original.acc_country.code + '.svg'}
              width={50}
            />
          </ListItemIcon>
          <ListItemText
            primary={row.original.acc_country.name}
            primaryTypographyProps={{ noWrap: true, fontWeight: 'bold' }}
          />
          {/* TODO - Countries can have accounts with different currencies so need to convert to the country currency when summing balances */}
          <CurrencyLabel
            value={row.getValue('current_balance')}
            currency={row.original.acc_country.currency}
          />
        </ListItem>
      )
    }
    case 'acc_currency': {
      const currency = getCurrencyFromCode(row.original.acc_iso_currency)
      return (
        <ListItem
          sx={{
            borderTop: (theme) => `1px solid ${theme.palette.grey[300]}`,
            borderBottom: (theme) => `1px solid ${theme.palette.grey[300]}`,
            backgroundColor: (theme) => theme.palette.grey[200],
            fontWeight: 'bold',
          }}
        >
          <ListItemIcon sx={{ fontSize: '2rem' }}>{currency.symbol}</ListItemIcon>
          <ListItemText
            primary={currency.name}
            primaryTypographyProps={{ noWrap: true, fontWeight: 'bold' }}
          />
          <CurrencyLabel
            value={row.getValue('current_balance')}
            currency={row.original.acc_iso_currency}
          />
        </ListItem>
      )
    }
    default:
      {
        // Account Row without any grouping
        if (row.original.id === -1) {
          // No Accounts Found for empty institutions
          return (
            <ListItem sx={{ textAlign: 'center' }}>
              {(groupBy === 'acc_type' ||
                groupBy === 'acc_owners' ||
                groupBy === 'acc_currency') && (
                <ListItemIcon>
                  <BankIcon logo={row.original.acc_institution?.logo} />
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  groupBy === 'acc_type' || groupBy === 'acc_owners'
                    ? `No Accounts Found For ${row.original.acc_institution?.name}`
                    : 'No Accounts Found'
                }
                secondary={
                  <a
                    onClick={() => onCreateAccount(row.original.acc_institution_id)}
                    style={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Add An Account
                  </a>
                }
              />
            </ListItem>
          )
        }
      }

      // Render an account row under a grouping row
      return (
        <StyledListItemButton
          disableRipple={true}
          onClick={() => onSelectAccount(row.original.id)}
          onDoubleClick={() => onEditAccount(row.original.id)}
          data-row={`account-${row.original.id}`}
          selected={row.original.id === selectedAccountId}
          sx={{ '& .currency-label': !row.original.acc_is_open ? { opacity: 0.6 } : {} }}
        >
          {(groupBy === 'acc_type' || groupBy === 'acc_owners' || groupBy === 'acc_currency') && (
            <ListItemIcon>
              <BankIcon logo={row.original.acc_institution?.logo} />
            </ListItemIcon>
          )}
          <ListItemText
            primary={row.original.acc_is_open ? row.original.name : `${row.original.name} (Closed)`}
            primaryTypographyProps={{
              noWrap: true,
              width: '98%',
              sx: !row.original.acc_is_open ? { opacity: 0.6 } : undefined,
            }}
            secondary={row.original.acc_type.name}
            secondaryTypographyProps={{
              noWrap: true,
              sx: !row.original.acc_is_open ? { opacity: 0.6 } : undefined,
            }}
          />
          <CurrencyLabel
            className="currency-label"
            value={row.getValue('current_balance')}
            currency={row.original.acc_iso_currency}
          />
        </StyledListItemButton>
      )
  }
}
