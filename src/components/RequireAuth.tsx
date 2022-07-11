import { PropsWithChildren, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

type RequireAuthProps = {
    routeWhenUnauthenticated: string
} & PropsWithChildren;

const RequireAuth: React.FC<RequireAuthProps> = ({ routeWhenUnauthenticated, children }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuthentication = onAuthStateChanged(auth, (user: User | null) => {
            if (user) {
                setLoading(false);
            } else {
                navigate(routeWhenUnauthenticated);
            }
        });

        return checkAuthentication();
    }, [auth]);

    if (loading) return <p>Loading...</p>;

    return <>{children}</>;
};

export default RequireAuth;