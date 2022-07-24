import { EventAvailable, OpenInNew, PeopleAlt, PermContactCalendar } from '@mui/icons-material';
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import getEventStats from '../hooks/getEventStats';
import { Event } from '../models';

type EventCardProps = {
    event: Event,
    key: number
};

const EventCard: React.FC<EventCardProps> = ({ event, key }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const openEventPage = () => navigate(`/event/${event.id}`);
    const { numberOfParticiants, bestDate } = getEventStats(event);

    return (<Grid item key={key}>
        <Card>
            <CardActionArea onClick={openEventPage}>
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {event.title}
                        <OpenInNew />
                    </Typography>

                    {event.description && <Typography variant='body1' color='text.secondary'>{event.description}</Typography>}

                    <Box sx={{ display: 'flex', flexDirection: 'row', mt: 2 }}>
                        <PermContactCalendar fontSize='small' />
                        <Typography variant='body2' pl={1}>
                            Creator: {event.creator.id === auth.currentUser!.uid ? `you` : event.creator.displayName}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <PeopleAlt fontSize='small' />
                        <Typography variant='body2' pl={1}>Attendees: {numberOfParticiants}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <EventAvailable fontSize='small' />
                        <Typography variant='body2' pl={1}>Best date: {bestDate}</Typography>
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    </Grid>);
}

export default EventCard;