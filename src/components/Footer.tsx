import { Box, Container, Link, Typography } from '@mui/material';

const Copyright: React.FC = () => {
    return <Typography variant='body2' color='text.secondary'>
        {'Copyright © '}<Link color='inherit' href='/'>DoOld</Link>{' '}{new Date().getFullYear()}{'.'}
    </Typography>;
};

const Footer: React.FC = () => {
    return <Box
        component='footer'
        sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800]
        }}>
        <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='body1'>This is my personal Doodle-like app because the official one sucks ass</Typography>
            <Copyright />
        </Container>
    </Box>;
};

export default Footer;