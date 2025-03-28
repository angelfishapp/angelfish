import CameraIcon from '@mui/icons-material/CameraAltOutlined'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'
import Slider from '@mui/material/Slider'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'
import AvatarEditor from 'react-avatar-editor'

import type { AvatarPickerDialogProps } from './AvatarDialog.interface'
import { StyledAvatar } from './AvatarDialog.styles'

/**
 * Form Field which provides a dialog to select an avatar from a list of avatars or upload a custom
 */

export default function AvatarPickerDialog({
  current,
  avatars,
  onSelect,
  open = false,
  onClose,
  size = 60,
  title = 'Pick Your Avatar',
}: AvatarPickerDialogProps) {
  const inputFile = React.useRef<HTMLInputElement>(null)
  const avatarEditor = React.useRef<AvatarEditor>(undefined)
  const [currentAvatar, setCurrentAvatar] = React.useState<string>(current)
  const [showUpload, setShowUpload] = React.useState<boolean>(false)
  const [uploadedImage, setUploadedImage] = React.useState<File | undefined>(undefined)
  const [editZoom, setEditZoom] = React.useState<number>(1)
  const [customAvatar, setCustomAvatar] = React.useState<string | undefined>(undefined)

  /**
   * Determine if user is using custom avatar or not
   */
  React.useEffect(() => {
    if (!avatars.includes(current)) {
      setCustomAvatar(current)
    } else {
      setCustomAvatar(undefined)
    }
  }, [avatars, current])

  const handleChooseFile = () => {
    inputFile.current?.click()
  }

  const handleSave = () => {
    if (avatarEditor) {
      const canvas = avatarEditor.current?.getImageScaledToCanvas()
      const dataURL = canvas?.toDataURL('image/png')
      setCustomAvatar(dataURL?.replace('data:image/png;base64,', ''))
      setCurrentAvatar(dataURL?.replace('data:image/png;base64,', '') || '')
      setShowUpload(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose?.()
        setTimeout(() => setShowUpload(false), 500)
      }}
      fullWidth={true}
      maxWidth="sm"
      sx={{
        '& h2': {
          fontSize: '1.25rem',
          fontWeight: 500,
          lineHeight: 1.6,
          letterSpacing: '0.0075em',
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {!showUpload && (
          <div>
            <Grid container spacing={1}>
              <Grid>
                <Tooltip title="Upload Custom Image" placement="top">
                  <StyledAvatar
                    className="upload"
                    onClick={() => {
                      setShowUpload(true)
                    }}
                    sx={{ width: size, height: size }}
                  >
                    <CameraIcon />
                  </StyledAvatar>
                </Tooltip>
              </Grid>
              {customAvatar && (
                <Grid>
                  <StyledAvatar
                    src={`data:image/png;base64, ${customAvatar}`}
                    className={currentAvatar == customAvatar ? 'selected' : undefined}
                    onClick={() => setCurrentAvatar(customAvatar)}
                    sx={{ width: size, height: size }}
                  />
                </Grid>
              )}
              {avatars.map((avatar, index) => (
                <Grid key={index}>
                  <StyledAvatar
                    src={`data:image/png;base64, ${avatar}`}
                    className={currentAvatar == avatar ? 'selected' : undefined}
                    onClick={() => setCurrentAvatar(avatar)}
                    sx={{ width: size, height: size }}
                  />
                </Grid>
              ))}
            </Grid>
            <DialogActions>
              <Button onClick={() => onSelect(currentAvatar)}>Select</Button>
            </DialogActions>
          </div>
        )}
        {showUpload && (
          <div>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Box display="block" width={300}>
                <Button onClick={handleChooseFile} color="primary">
                  Choose File
                </Button>
                <AvatarEditor
                  ref={avatarEditor as React.LegacyRef<AvatarEditor>}
                  image={uploadedImage || ''}
                  width={200}
                  height={200}
                  border={50}
                  borderRadius={100}
                  color={[255, 255, 255, 0.6]} // RGBA
                  rotate={0}
                  scale={editZoom}
                />
                <Grid container spacing={2}>
                  <Grid size={2}>
                    <ZoomOutIcon />
                  </Grid>
                  <Grid size="grow">
                    <Slider
                      aria-label="raceSlider"
                      value={editZoom}
                      min={1}
                      max={10}
                      step={0.1}
                      onChange={(event, value) => setEditZoom(value as number)}
                    />
                  </Grid>
                  <Grid size={2}>
                    <ZoomInIcon />
                  </Grid>
                </Grid>
                <input
                  type="file"
                  ref={inputFile}
                  accept=".jpg,.png,.jpeg,.gif"
                  style={{ display: 'none' }}
                  onChange={(event) => {
                    if (event.target.files) {
                      setUploadedImage(event.target.files[0])
                    }
                  }}
                />
              </Box>
            </Box>
            <DialogActions>
              <Button variant="outlined" onClick={() => setShowUpload(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogActions>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
