import { PropsWithChildren, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

type RequireAuthProps = {
    routeWhenAuthenticated: string
} & PropsWithChildren;

const UnRequireAuth: React.FC<RequireAuthProps> = ({ routeWhenAuthenticated, children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                navigate(routeWhenAuthenticated);
            } else {
                setLoading(false);
            }
        });

        return checkAuthentication();
    }, [auth]);

    if (loading) return <CircularProgress aria-label='Loading...' />;

    return <>{children}</>;
};

export default UnRequireAuth;