import { styled } from '@mui/system'

export const VideoMainContainer = styled('div')(() => ({
  position: 'relative',
  paddingBottom: '56.25%',
  height: 0,
}))

export const IframeContainer = styled('div')(() => ({
  position: 'relative',
  paddingBottom: '56.25%',
  height: 0,
}))

export const Iframe = styled('iframe')(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  border: 'none',
}))
