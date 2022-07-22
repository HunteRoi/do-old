import { PropsWithChildren, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

type RequireAuthProps = {
    routeWhenUnauthenticated: string
} & PropsWithChildren;

const RequireAuth: React.FC<RequireAuthProps> = ({ routeWhenUnauthenticated, children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setLoading(false);
            } else {
                navigate(routeWhenUnauthenticated, { state: { from: location.pathname } });
            }
        });

        return checkAuthentication();
    }, [auth]);

    if (loading) return <CircularProgress aria-label='Loading...' />;

    return <>{children}</>;
};

export default RequireAuth;