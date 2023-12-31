import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import * as React from 'react';
type Props = {
  children?: React.ReactNode;
};

declare module '@mui/material/styles' {
  // index signature typegradients

  interface TypeGradient {
    [key: string]: string;
  }

  interface Palette {
    gradient: TypeGradient;
    text: TypeText2;
  }
  interface TypeColor {
    Darkest?: string;
    Darker?: string;
    Dark?: string;
    Base?: string;
    Light?: string;
    Lighter?: string;
    Lightest?: string;
    White?: string;
  }
  interface TypeText2 {
    primary: string;
    secondary: string;
    disabled: string;
  }
  interface PaletteOptions {
    gradient: TypeGradient;
    Ink: TypeColor;
    Sky: TypeColor;
    Red: TypeColor;
    Green: TypeColor;
  }

  interface TypeBackground {
    opposite: string;
  }
  interface TypographyVariants {
    CTA1: React.CSSProperties;
    CTA2: React.CSSProperties;
    CTA3: React.CSSProperties;
    body3: React.CSSProperties;
    body4: React.CSSProperties;
    Body1: React.CSSProperties;
    Body2: React.CSSProperties;
    Body3: React.CSSProperties;
    Body1Medium: React.CSSProperties;
    Body1SemiBold: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    CTA1?: React.CSSProperties;
    CTA2?: React.CSSProperties;
    CTA3?: React.CSSProperties;
    body3?: React.CSSProperties;
    body4?: React.CSSProperties;
    Body1?: React.CSSProperties;
    Body2?: React.CSSProperties;
    Body3?: React.CSSProperties;
    Body1Medium?: React.CSSProperties;
    Body1SemiBold?: React.CSSProperties;
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    CTA1: true;
    CTA2: true;
    CTA3: true;
    body3: true;
    body4: true;
    Body1: true;
    Body2: true;
    Body3: true;
    Body1Medium: true;
    Body1SemiBold: true;
  }
}
export const AppThemeProvider: React.FC<Props> = ({ children }) => {
  const theme = responsiveFontSizes(
    createTheme({
      palette: {
        primary: {
          main: '#141414', 
        },
        secondary: {
          main: '#1DB954',
        },
        Ink: {
          Darkest: '#000000',
          Darker: '#222222',
          Dark: '#303437',
          Base: '#404446',
          Light: '#6C7072',
          Lighter: '#72777A',
        },
        Sky: {
          Dark: '#979C9E',
          Base: '#CDCFD0',
          Light: '#E3E5E5',
          Lighter: '#F2F4F5',
          Lightest: '#F7F9FA',
          White: '#FFFFFF',
        },

        Red: {
          Darkest: '#6B0206',
          Base: '#E8282B',
          Light: '#F94739',
          Lighter: '#FF9898',
          Lightest: '#FFE5E5',
        },

        Green: {
          Darkest: '#0A4C0A',
          Base: '#0F8B0F',
          Light: '#1EB01E',
          Lighter: '#7FF77F',
          Lightest: '#E5FFE5',
        },
        background: {
          default: '#000000',
          opposite: '#999999',
          paper: '#C3C1BD',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#000000',
          disabled: '#FCFCFC',
        },
    
  
        grey: {
          50: 'hsl(0, 5%, 95%)',
          100: 'hsl(0, 0%, 90%)',
          200: 'hsl(0, 0%, 80%)',
          300: 'hsl(0, 0%, 70%)',
          400: 'hsl(0, 0%, 60%)',
          500: 'hsl(0, 0%, 50%)',
          600: 'hsl(0, 0%, 40%)',
          700: 'hsl(0, 0%, 30%)',
          800: 'hsl(0, 0%, 20%)',
          900: 'hsl(0, 0%, 10%)',
        },
        gradient: {
          bronze: 'linear-gradient(180deg, #9C6D3E 0%, #E8C8A9 100%)',
          silver: 'linear-gradient(180deg, #808080 0%, #DFDFDF 100%)',
          gold: 'linear-gradient(180deg, #A3873C 0%, #E3D294 100%)',
        },
      },

      typography: {
        fontFamily: 'Lato, sans-serif',

        h1: {
          fontSize: '48px',
          fontWeight: '600',
          // lineHeight: '33px',
        },
        h2: {
          fontSize: '36px',
          fontWeight: '600',
          // lineHeight: '28px',
        },
        h3: {
          fontSize: '30px',
          fontWeight: '600',
          // lineHeight: '25px',
        },
        h4: {
          fontSize: '24px',
          fontWeight: '600',
          // lineHeight: '23px',
        },
        h5: {
          fontSize: '18px',
          fontWeight: '500',
          // lineHeight: '20px',
        },
        h6: {
          fontSize: '16px',
          fontWeight: '500',
          // lineHeight: '20px',
        },

        CTA1: {
          fontSize: '36px',
          fontWeight: '500',
          // lineHeight: '35px',
        },
        CTA2: {
          fontSize: '18px',
          fontWeight: '500',
          // lineHeight: '23px',
        },
        CTA3: {
          fontSize: '16px',
          fontWeight: '400',
          // lineHeight: '20px',
        },
        Body1: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '14px',
          fontWeight: '200',
          // lineHeight: '18px',
        },
        Body2: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '13px',
          fontWeight: '200',
          // lineHeight: '16px',
        },
        Body3: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '12px',
          fontWeight: '200',
          // lineHeight: '14px',
        },
        Body1Medium: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          // lineHeight: '17px',
        },
        Body1SemiBold: {
          fontFamily: 'Lato, sans-serif',
          fontSize: '14px',
          fontWeight: '600',
          // lineHeight: '17px',
        },
        body3: {
          fontSize: '12px',
          // lineHeight: '16px',
          display: 'block',
        },
        body4: {
          fontSize: '10px',
          // lineHeight: '14px',
          display: 'block',
        },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              // ---CSS BODY--- \\
              color: '#FFFFFF',
            },
          },
        },
        MuiLink: {
          styleOverrides: {
            root: {
              cursor: 'pointer',
              textDecoration: 'none',
              lineHeight: '16px',
              transition: 'all 0.1s ease-in-out',
              '&:hover': {
                opacity: 0.8,
              },
            },
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: {
              aspectRatio: '1/1',
            },
          },
        },
      },
    }),
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};