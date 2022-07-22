import { CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';
import EventSummary from '../components/EventSummary';

import getEvent from '../hooks/getEvent';

const EventPage: React.FC = () => {
    const { event, loading, updateAttendance } = getEvent();

    if (loading) return <CircularProgress aria-label='Loading...' />;
    if (!event) return <Navigate to='/' />;

    return <EventSummary event={event} onSubmit={updateAttendance} />;
};

export default EventPage;