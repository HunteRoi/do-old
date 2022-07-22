import { Box, Container, Typography } from "@mui/material";
import { FormatAlignLeft } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Event, AttendingChoices} from "../models";
import ParticipationForm from '../components/ParticipationForm';

dayjs.extend(relativeTime);

type EventSummaryProps = {
    event: Event,
    onSubmit: (data: AttendingChoices) => Promise<void>
};

const EventSummary: React.FC<EventSummaryProps> = ({ event, onSubmit }) => {
    return <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} maxWidth='xl'>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 3 }}>
            <Typography variant='h4'>{event.title}</Typography>
            <Typography variant='overline' sx={{ m: 0, p: 0 }}>
                By {event.creator.displayName} | {dayjs(event.creationDate.toDate()).fromNow()}
            </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', my: 3 }}>
            <FormatAlignLeft fontSize='small' sx={{ mr: 2 }} />
            <Typography>{event.description}</Typography>
        </Box>

        <ParticipationForm attendanceData={event.attendanceData} onFormSubmit={onSubmit} />
    </Container>;
};

export default EventSummary;