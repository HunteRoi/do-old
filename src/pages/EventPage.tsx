import { CircularProgress } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

import EventSummary from '../components/EventSummary';
import getEvent from '../hooks/getEvent';

const EventPage: React.FC = () => {
    const { event, loading, updateAttendance, deleteEvent } = getEvent();
    const navigate = useNavigate();

    const handleDelete = async () => {
        await deleteEvent();
        navigate('/');
    };

    if (loading) return <CircularProgress aria-label='Loading...' />;
    if (!event) return <Navigate to='/' />;

    return <EventSummary event={event} onSubmit={updateAttendance} onDelete={handleDelete} />;
};

export default EventPage;