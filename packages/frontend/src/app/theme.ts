/**
 * Custom Theme for App - Make sure you include this file as an import in any tsx files
 * that are using the custom Theme properties or the editor will not pick it up and show
 * errors:
 *
 *      import "@/app/theme"
 *
 * To add new custom properties, extend the interfaces below. Ideally we should be putting
 * all custom properties under 'custom' in the Theme interface.
 *
 */

import type { Theme, ThemeOptions } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

/**
 * Override types using Typescript's Module Augmentation
 */

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: {
        morning: string
        daytime: string
        evening: string
        night: string
      }
      side: {
        width: number
      }
      colors: {
        inputUnfocused: string
        inputFocused: string
        tagBackground: string
        tagColor: string
      }
    }
  }

  interface ThemeOptions extends Partial<Theme> {
    components?: ThemeOptions['components'] & {}
  }
}

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line  @typescript-eslint/no-empty-object-type
  interface DefaultTheme extends Theme {}
}

/**
 * Custom Theme
 */
const angelfishTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1B5678',
      light: '#2A86BB',
      dark: '#10364C',
    },
    secondary: {
      main: '#47CCAF',
    },
  },
  typography: {
    fontFamily: '"Mukta", -apple-system, BlinkMacSystemFont, "Segoe UI"',
    fontSize: 14,
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        color: 'primary',
      },
      styleOverrides: {
        root: {
          border: 0,
          borderRadius: 48,
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
          height: 48,
          padding: '0 30px',
        },
        contained: {
          boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)',
        },
        text: {
          boxShadow: 'none',
        },
        outlined: {
          color: '#000',
        },
        outlinedPrimary: ({ theme }) => ({
          border: `1px solid ${theme.palette.primary.main}`,
        }),
      },
    },

    MuiPaper: {
      defaultProps: {
        elevation: 8,
      },
      styleOverrides: {
        rounded: {
          borderRadius: 20,
          padding: 20,
        },
      },
    },

    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
          '&:hover': {
            color: 'inherit',
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: 0,
          borderRadius: 8,
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          padding: 0,
          borderRadius: 8,
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: 0,
        },
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        '& .scrollbar': {
          // style scrollbar in Table Container
          '&::-webkit-scrollbar': {
            width: '7px',
            height: '7px',
            backgroundColor: 'whitesmoke',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '50em',
            backgroundColor: 'rgba(43, 43, 43, 0.65)',
          },
          '&::-webkit-scrollbar-thumb:focus': {
            backgroundColor: '#2b2b2b',
          },
          '&::-webkit-scrollbar:hover': {
            backgroundColor: '#d4d4d4',
          },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          padding: 0,
          borderRadius: 8,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: theme.custom.colors.inputFocused,
                borderWidth: 1,
              },
            },
          },
        }),
      },
    },

    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            fontSize: 18,
            padding: '12px 16px',
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          // inherit background from row to show zebra on sticky rows
          background: 'inherit',
          color: 'inherit',
          textAlign: 'left',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '.MuiTableBody-root &:hover': {
            backgroundColor: '#FFD2B8',
          },
          '&.Mui-selected > td': {
            backgroundColor: '#D9E1E8 !important',
          },
          '&.Mui-selected:hover > td': {
            backgroundColor: '#D9E1E8 !important',
          },
        },
      },
    },
  },
  custom: {
    side: {
      width: 80,
    },
    gradients: {
      morning: `linear-gradient(180deg, #F16872 0%, #FF9454 77.79%)`,
      daytime: `linear-gradient(180deg, #F8D092 0.2%, #47CCAF 77.79%)`,
      evening: `linear-gradient(180deg, #1B5678 0%, #47CCAF 77.79%)`,
      night: `#092230`,
    },
    colors: {
      inputUnfocused: `#DCDCDC`,
      inputFocused: `#1498DF`,
      tagBackground: `#A1D4F0`,
      tagColor: `#075078`,
    },
  },
}

export default createTheme(angelfishTheme)
