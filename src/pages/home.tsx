import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { signOut } from '../config/firebase';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const onSignOutClick = async () => {
        await signOut();
        navigate('/login');
    }

    return <div>
        <h1>HomePage</h1>
        <button onClick={onSignOutClick}>Sign out</button>

        <EventForm />
    </div>;
}

export default HomePage;