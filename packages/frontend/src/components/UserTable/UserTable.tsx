import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import React from 'react'

import { Avatar } from '@/components/Avatar'
import { Table } from '@/components/Table'
import type { UserTableProps } from './UserTable.interface'

/**
 * Book Members Table. Lists users and allows user to manage and edit them.
 *
 * Contains UserDrawer and ConfirmDialog components which are opened when a user edits, creates
 * or deletes a user.
 */
export default function UserTable({
  authenticated_user_id,
  users,
  onCreate,
  onEdit,
  onDelete,
}: UserTableProps) {
  // Render
  return (
    <Table
      sx={{
        border: (theme) => `1px solid ${theme.palette.grey[400]}`,
      }}
      columns={[
        {
          id: 'avatar',
          header: 'Avatar',
          accessorKey: 'avatar',
          size: 90,
          cell: ({ row }) => {
            return (
              <Avatar
                avatar={row.original.avatar}
                firstName={row.original.first_name}
                lastName={row.original.last_name}
                size={50}
              />
            )
          },
        },
        {
          id: 'first_name',
          header: 'First Name',
          accessorKey: 'first_name',
        },
        {
          id: 'last_name',
          header: 'Last Name',
          accessorKey: 'last_name',
        },
        {
          id: 'email',
          header: 'Email',
          accessorKey: 'email',
        },
        {
          id: 'role',
          header: 'Role',
          accessorKey: 'role',
          size: 90,
          cell: ({ row }) => {
            return authenticated_user_id === row.original.cloud_id ? 'Owner' : 'Member'
          },
        },
        {
          id: 'createdOn',
          header: 'Created On',
          accessorKey: 'createdOn',
          size: 130,
          cell: ({ row }) => {
            if (row.original.created_on === undefined) return ''
            return row.original.created_on?.toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          },
        },
        {
          id: 'actions',
          header: 'Actions',
          size: 120,
          cell: ({ row }) => {
            return (
              <React.Fragment>
                <IconButton
                  aria-label="edit"
                  onClick={() => onEdit(row.original)}
                  title="Edit User"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  aria-label="delete"
                  onClick={() => onDelete(row.original)}
                  title="Delete User"
                  color="error"
                  disabled={authenticated_user_id === row.original.cloud_id}
                >
                  <DeleteIcon />
                </IconButton>
              </React.Fragment>
            )
          },
        },
      ]}
      data={users}
      displayFooter={true}
      FooterElement={({ headerGroup }) => {
        return (
          <tr>
            <td
              colSpan={headerGroup.headers.length}
              style={{ padding: 5, fontWeight: 700, textAlign: 'center' }}
            >
              <Button variant="contained" onClick={() => onCreate()}>
                Add Member
              </Button>
            </td>
          </tr>
        )
      }}
    />
  )
}
