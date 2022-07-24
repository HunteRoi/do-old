import { PropsWithChildren, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

type RequireUnauthProps = {
    routeWhenAuthenticated: string
} & PropsWithChildren;

const RequireUnauth: React.FC<RequireUnauthProps> = ({ routeWhenAuthenticated, children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                let to = routeWhenAuthenticated;
                if (window.location.hash !== '') {
                    to = window.location.hash.substring(1);
                }
                navigate(to);
            } else {
                setLoading(false);
            }
        });

        return checkAuthentication();
    }, [auth]);

    if (loading) return <CircularProgress aria-label='Loading...' />;

    return <>{children}</>;
};

export default RequireUnauth;