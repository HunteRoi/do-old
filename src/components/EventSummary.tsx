import { Box, Button, Container, Typography } from '@mui/material';
import { Delete, FormatAlignLeft, Share } from '@mui/icons-material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import { Event, AttendingChoices} from '../models';
import ParticipationForm from '../components/ParticipationForm';
import { getAuth } from 'firebase/auth';

dayjs.extend(relativeTime);

type EventSummaryProps = {
    event: Event,
    onSubmit: (data: AttendingChoices, shouldDelete: boolean) => Promise<void>,
    onDelete: () => Promise<void>
};

const EventSummary: React.FC<EventSummaryProps> = ({ event, onSubmit, onDelete }) => {
    const auth = getAuth();

    const copyToClipboard = async () => {
        console.log('Using navigator.clipboard');
        await navigator.clipboard.writeText(window.location.href);
    };

    const shareExternal = async () => {
        if (navigator.share) {
          console.log('Using navigator.share');

          await navigator.share({
            title: event.title,
            text: event.description ?? 'A new event from DoOld!',
            url: window.location.href,
          });
        } else {
          console.log('No navigator.share, defaulting to navigator.clipboard');

          await copyToClipboard();
        }
      };

    return <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} maxWidth='xl'>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', my: 3 }}>
            <Typography variant='h4'>{event.title}</Typography>
            <Typography variant='overline' sx={{ m: 0, p: 0 }}>
                By {event.creator.displayName} | {dayjs(event.creationDate.toDate()).fromNow()}
            </Typography>
        </Box>

        {event.description && <Box sx={{ display: 'flex', flexDirection: 'row', my: 3 }}>
            <FormatAlignLeft fontSize='small' sx={{ mr: 2 }} />
            <Typography>{event.description}</Typography>
        </Box>}

        <ParticipationForm attendanceData={event.attendanceData} onFormSubmit={onSubmit} />

        <Box sx={{ m: 3, display: 'flex', flexDirection: 'row', gap: 1 }}>
            { auth && auth.currentUser && auth.currentUser.uid === event.creator.id &&
                <Button variant='outlined' startIcon={<Delete />} onClick={onDelete}>Delete</Button>
            }
            <Button variant='contained' startIcon={<Share />} onClick={shareExternal}>Share</Button>
        </Box>
    </Container>;
};

export default EventSummary;