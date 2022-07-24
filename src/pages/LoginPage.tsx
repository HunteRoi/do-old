import { Box, Button, Icon, Typography, Container } from '@mui/material';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

import { Providers, signIn } from '../config/firebase';

const Google = () => <Icon sx={{ textAlign: 'center' }}><img style={{ display: 'flex', height: 'inherit', width: 'inherit' }} src='/svg/google.svg' alt='Google' /></Icon>;
const Facebook = () => <Icon sx={{ textAlign: 'center' }}><img style={{ display: 'flex', height: 'inherit', width: 'inherit' }} src='/svg/facebook.svg' alt='Facebook' /></Icon>;

const LoginPage: React.FC = () => {
    const auth = getAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isAuthenticating, setAuthenticating] = useState(false);
    const isFacebookInAppUserAgent = /FB_IAB/.test(navigator.userAgent) || /FBAN/.test(navigator.userAgent) || /FBAV/.test(navigator.userAgent);

    const onSignInClick = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        setAuthenticating(true);

        if (location.state && (location.state as any).from) {
            window.location.hash = (location.state as any).from;
        }

        await signIn(provider);

        if (location.state && (location.state as any).from) {
            navigate((location.state as any).from);
        }
        else navigate('/');
    };

    if (auth.currentUser) {
        return <Navigate to='/' />;
    }

    return <Container maxWidth='sm' sx={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', minHeight:'75vh' }}>
        <Box sx={{ my: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h3'>Welcome on DoOld</Typography>
                <Typography variant='subtitle1' component='p' sx={{ mb: 2 }}>
                    a clone of the old Doodle interface!
                </Typography>
            </Box>

            <Typography variant='body1' component='p'>
                Here, no need to fill impossible forms only to know when your friends are available for a drink.
            </Typography>
            <Typography variant='body1' component='p'>
                Give a title to your event, choose some dates and shoot! You then only have to share your event with your friends and let them submit their info!
            </Typography>
            <Typography variant='body1' component='p'>
                And in case your friends submitted shit in their attendance, you can still edit their rows 😉
            </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 1, gridTemplateRows: 'repeat(2, 1fr)', mt: 5 }}>
            <Button sx={{ backgroundColor: '#4285F4' }} variant='contained' disabled={isAuthenticating || isFacebookInAppUserAgent} startIcon={<Google />} onClick={() => onSignInClick(Providers.google)}>Log in with Google</Button>
            {isFacebookInAppUserAgent && <Typography variant='caption'>You cannot login with Google through Facebook or Messenger InApp Browser!</Typography>}
            <Button sx={{ backgroundColor: '#3b5998' }} variant='contained' disabled={isAuthenticating} startIcon={<Facebook />} onClick={() => onSignInClick(Providers.facebook)}>Log in with Facebook</Button>
        </Box>
    </Container>
};

export default LoginPage;