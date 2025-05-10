import EditIcon from '@mui/icons-material/CameraAltOutlined'
import React from 'react'

import { Avatar } from '../../Avatar'
import { FormField } from '../FormField'
import type { AvatarFieldProps } from './AvatarField.interface'
import { StyledAvatarBadge } from './AvatarField.styles'
import AvatarDialog from './components/AvatarDialog'

/**
 * Will display current avatar with edit button on hover and
 * open an Avatar selection dialog for user to select out of the box avatar or
 * upload their own custom image.
 */

export default React.forwardRef<HTMLDivElement, AvatarFieldProps>(function AvatarField(
  {
    avatars,
    onChange,
    Icon,
    size = 80,
    dialogSize = 60,
    dialogTitle = 'Pick Your Avatar',
    value,
    ...formFieldProps
  }: AvatarFieldProps,
  ref,
) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  /**
   * Handle selecting an Avatar in dialog, will trigger onChange
   * if the value has changed
   */
  const handleSelect = (avatar: string) => {
    onChange(avatar)
    setIsOpen(false)
  }

  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <StyledAvatarBadge
        overlap="circular"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        color="primary"
        badgeContent={<EditIcon fontSize="small" />}
        size={size}
        onClick={() => setIsOpen(true)}
      >
        <Avatar avatar={value} size={size} displayBorder={true} Icon={Icon} />
      </StyledAvatarBadge>
      <AvatarDialog
        current={value ?? ''}
        avatars={avatars}
        onSelect={handleSelect}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size={dialogSize}
        title={dialogTitle}
      />
    </FormField>
  )
})
