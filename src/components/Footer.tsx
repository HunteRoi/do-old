import { Box, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const Copyright: React.FC = () => {
    return <Typography variant='body2' color='text.secondary'>
        {'Copyright © '}<Link color='inherit' to='/'>DoOld</Link>{' '}{new Date().getFullYear()}{'.'}
    </Typography>;
};

const Footer: React.FC = () => {
    return <Box
        component='footer'
        sx={{
            py: 2,
            px: 1,
            mt: 'auto',
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                ? theme.palette.grey[200]
                : theme.palette.grey[800]
        }}>
        <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='body1'>This is my personal Doodle-like app because the official one sucks ass</Typography>
            <Copyright />
            <Box sx={{ mt: 1, mx: 0 }}>
                <Link to='/privacypolicy'>
                    <Typography variant='caption'>Privacy Policy</Typography>
                </Link>
                {' | '}
                <Link to='terms'>
                    <Typography variant='caption'>Terms Of Service</Typography>
                </Link>
            </Box>
        </Container>
    </Box>;
};

export default Footer;