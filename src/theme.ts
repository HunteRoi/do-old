import { createTheme, ThemeOptions } from '@mui/material/styles';

export const themeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        primary: {
            main: '#0E131F',
        },
        secondary: {
            main: '#CB9F5D',
        },
        background: {
            default: '#eeeeee',
        },
        warning: {
            main: '#DD9270',
        },
        error: {
            main: '#FF0035',
        },
        success: {
            main: '#7ADD70',
        }
    }
};

export const dooldTheme = createTheme(themeOptions);