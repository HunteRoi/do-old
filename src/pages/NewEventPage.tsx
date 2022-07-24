import { useNavigate } from 'react-router-dom';

import { createEvent } from '../config/firebase';
import EventForm from '../components/EventForm';
import { Event } from '../models';
import { Typography } from '@mui/material';

const NewEventPage: React.FC = () => {
    const navigate = useNavigate();

    const onSubmit = async (event: Event) => {
        await createEvent(event);
        navigate(`/event/${event.id}`);
    };

    return <>
        <Typography variant='h3'>Create a new event!</Typography>
        <EventForm onFormSubmit={onSubmit} />
    </>;
};

export default NewEventPage;