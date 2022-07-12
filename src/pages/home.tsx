import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import { signOut } from '../config/firebase';
import { Event } from '../models';

const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const onSignOutClick = async () => {
        await signOut();
        navigate('/login');
    };

    const onSubmit = async (event: Event) => {
        console.log(event);
    };

    return <>
        <h1>HomePage</h1>
        <button onClick={onSignOutClick}>Sign out</button>

        <EventForm onFormSubmit={onSubmit} />
    </>;
};

export default HomePage;