import ButtonBase from '@mui/material/ButtonBase'
import { styled } from '@mui/material/styles'

export const BUBBLE_SIZE = 196

/**
 * CategoryGroupBubble Component Styles
 */

type CategoryGroupButtonProps = {
  selected?: boolean
}

export const CategoryGroupButton = styled(ButtonBase, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<CategoryGroupButtonProps>(({ theme, selected }) => ({
  display: 'inline-flex',
  position: 'relative',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: selected ? 'none' : `url(/assets/img/category_bubble.png)`,
  backgroundColor: selected ? 'rgba(255,255,255,0.67)' : 'transparent',
  backgroundSize: 'contain',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backdropFilter: 'blur(8px)',
  borderRadius: '50%',
  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
  paddingBottom: theme.spacing(2),
  height: BUBBLE_SIZE,
  width: BUBBLE_SIZE,
  whiteSpace: 'nowrap',
  margin: theme.spacing(2),
  cursor: 'pointer',

  '&:before': {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    height: `calc(100% - ${theme.spacing(1)})`,
    width: `calc(100% - ${theme.spacing(1)})`,
    borderRadius: '50%',
    border: `4px solid transparent`,
    margin: theme.spacing(0.5),
    zIndex: 100,
    pointerEvents: 'none',
  },

  '&:after': {
    content: "''",
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.0)',
    transition: 'all 225ms cubic-bezier(0.4, 0, 0.2, 0.15)',
    pointerEvents: 'none',
  },

  '&:hover:after': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  '& div': {
    color: selected ? theme.palette.common.black : theme.palette.common.white,
  },
}))

export const CategoryGroupIcon = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 64,
  width: 64,
}))

export const CategoryGroupTitle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  padding: `0 ${theme.spacing(2)}`,
  width: BUBBLE_SIZE,
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  whiteSpace: 'pre-wrap',
  WebkitLineClamp: 2,
  fontWeight: 700,
  fontSize: 18,
  textAlign: 'center',
  lineHeight: 1,
  marginBottom: theme.spacing(0.5),
}))

export const CategoryGroupCount = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(0.5),
  fontSize: 14,
}))

export const EditLabel = styled('div')(({ theme }) => ({
  color: `${theme.palette.primary.main} !important`,
  cursor: 'pointer',
}))
