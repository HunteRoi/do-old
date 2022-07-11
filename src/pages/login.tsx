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

    return <div>
        <button disabled={isAuthenticating} onClick={() => onSignInClick(Providers.google)}>Log in with Google</button>
        <button disabled={isAuthenticating} onClick={() => onSignInClick(Providers.facebook)}>Log in with Facebook</button>
    </div>
}

export default LoginPage;