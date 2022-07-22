import { Box, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Facebook, Google } from '@mui/icons-material';
import { FacebookAuthProvider, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';

import { Providers, signIn } from '../config/firebase';

const LoginPage: React.FC = () => {
    const auth = getAuth();
    const [isAuthenticating, setAuthenticating] = useState(false);
    const navigate = useNavigate();

    const onSignInClick = async (provider: GoogleAuthProvider | FacebookAuthProvider) => {
        setAuthenticating(true);
        await signIn(provider);
        navigate('/');
    };

    if (auth.currentUser) {
       return <Navigate to='/' />;
    }

    return <Container maxWidth='xs'>
        <Box sx={{ display: 'grid', gap: 1, gridTemplateRows: 'repeat(2, 1fr)' }}>
            <LoadingButton color='warning' variant='contained' disabled={isAuthenticating} startIcon={<Google />} onClick={() => onSignInClick(Providers.google)}>Log in with Google</LoadingButton>
            <LoadingButton variant='contained' disabled={isAuthenticating} startIcon={<Facebook />} onClick={() => onSignInClick(Providers.facebook)}>Log in with Facebook</LoadingButton>
        </Box>
    </Container>
};

export default LoginPage;