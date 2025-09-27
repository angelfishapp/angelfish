import type { SxProps, Theme } from '@mui/material'

export const containerBox: SxProps<Theme> = {
  borderRadius: 2,
  p: 2,
  bgcolor: 'background.paper',
}

export const listItem: (selected: boolean) => SxProps<Theme> = (selected) => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px solid',
  borderColor: 'grey.300',
  borderRadius: 1,
  mb: 1,
  p: 1.5,
  gap: 2,
  bgcolor: selected ? 'primary.lighter' : 'transparent',
  transition: 'all 0.2s ease-in-out',
})

export const dropZone: (isDragging: boolean) => SxProps<Theme> = (isDragging) => ({
  border: isDragging ? '3px solid' : '2px dashed',
  borderColor: isDragging ? 'primary.main' : 'grey.500',
  borderRadius: 2,
  p: 5,
  textAlign: 'center',
  cursor: 'pointer',
  bgcolor: isDragging ? 'primary.lighter' : 'transparent',
  transition: 'all 0.2s ease-in-out',
})

export const uploadIcon: (isDragging: boolean) => SxProps<Theme> = (isDragging) => ({
  fontSize: 48,
  color: isDragging ? 'primary.main' : 'grey.600',
  mb: 1,
})

export const errorText: SxProps<Theme> = {
  display: 'block',
  mb: 1,
}

export const clearButton: SxProps<Theme> = {
  color: 'error.main',
}
