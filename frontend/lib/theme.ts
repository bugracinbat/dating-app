import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      gradients: {
        primary: string;
        secondary: string;
        accent: string;
      };
    };
  }
  
  interface ThemeOptions {
    custom?: {
      gradients?: {
        primary?: string;
        secondary?: string;
        accent?: string;
      };
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F4C430', // Bumble Yellow
      dark: '#E5B520',
      light: '#FFD84D',
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6E3A', // Bumble Orange
      dark: '#E55A2B',
      light: '#FF8A5C',
      contrastText: '#fff',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#F7F7F7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #F4C430 0%, #FF6E3A 100%)',
          color: '#fff',
          '&:hover': {
            background: 'linear-gradient(135deg, #E5B520 0%, #E55A2B 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            '&:hover fieldset': {
              borderColor: '#F4C430',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#F4C430',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover': {
            backgroundColor: 'rgba(244, 196, 48, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
          color: '#1a1a1a',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          borderTop: '1px solid #e0e0e0',
          height: 70,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#F4C430',
          },
        },
      },
    },
  },
  custom: {
    gradients: {
      primary: 'linear-gradient(135deg, #F4C430 0%, #FF6E3A 100%)',
      secondary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      accent: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
  },
});

export default theme;