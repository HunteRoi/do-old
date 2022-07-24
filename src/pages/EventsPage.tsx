import { Add } from '@mui/icons-material';
import { Button,  CircularProgress, Container, Grid, Paper, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import getUserEvents from '../hooks/getUserEvents';
import EventCard from '../components/EventCard';

const EventsPage: React.FC = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { events, loading } = getUserEvents(auth.currentUser?.uid ?? null);

    if (loading) return <CircularProgress aria-label='Loading...' />;

    return <>
        <Typography variant='h3' mb={2}>Your Events</Typography>

        <Container sx={{ mb: 1 }}>
            <Button variant='contained' color='secondary' startIcon={<Add />} onClick={() => navigate('/new')}>Create new</Button>
        </Container>

        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                flexGrow: 1,
                backgroundColor: '#0E131F'
            }}>
            <Grid container spacing={2}>
                {events.map((event, index) => <EventCard key={index} event={event} />)}
            </Grid>
        </Paper>
    </>;
};

export default EventsPage;