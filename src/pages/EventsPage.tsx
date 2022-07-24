import { Add, EventAvailable, OpenInNew, PeopleAlt, PermContactCalendar } from "@mui/icons-material";
import { Box, Button, Card, CardActionArea, CardContent, CircularProgress, Container, Grid, Paper, Typography } from "@mui/material";
import { getAuth } from "firebase/auth";

import { Event } from '../models';
import getUserEvents from "../hooks/getUserEvents";
import getEventStats from "../hooks/getEventStats";
import { useNavigate } from "react-router-dom";

const EventsPage: React.FC = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const { events, loading } = getUserEvents(auth.currentUser?.uid ?? null);

    const openEventPage = (event: Event) => navigate(`/event/${event.id}`);

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
                {events.map((event, index) => {
                    const { numberOfParticiants, bestDate } = getEventStats(event);

                    return (<Grid item key={index} xs={2} sm={4} md={4}>
                            <Card>
                                <CardActionArea onClick={() => openEventPage(event)}>
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
                                            <Typography variant='body2' pl={1}>Participants: {numberOfParticiants}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <EventAvailable fontSize='small' />
                                            <Typography variant='body2' pl={1}>Best date: {bestDate}</Typography>
                                        </Box>

                                    </CardContent>
                                </CardActionArea>
                            </Card>
                    </Grid>);
                })}
            </Grid>
        </Paper>
    </>;
};

export default EventsPage;