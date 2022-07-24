import { FormEvent, useState } from 'react';
import { v4 as generateUuid } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import { TextField, Box, Button } from '@mui/material';
import { EventNote } from '@mui/icons-material';
import dayjs from 'dayjs';

import { Event } from '../models';
import useFormElement from '../hooks/useFormElement';
import MultipleDatesPicker from './MultipleDatesPicker';
import { getAuth } from 'firebase/auth';
import getPhotoURL from '../hooks/getPhotoURL';

type EventFormProps = {
    onFormSubmit: (event: Event) => Promise<void>
};

const EventForm: React.FC<EventFormProps> = ({ onFormSubmit }) => {
    const now = dayjs();
    const titleInput = useFormElement<HTMLInputElement, string>('');
    const descriptionInput = useFormElement<HTMLTextAreaElement, string>('');
    const [values, setValues] = useState([
        dayjs().hour(0).minute(0).second(0).millisecond(0)
    ]);
    const [submitting, setSubmitting] = useState(false);
    const auth = getAuth();

    const onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitting(true);

        if (!titleInput.element.value) {
            titleInput.setError(true);
        }

        if (!titleInput.element.value) {
            setSubmitting(false);
            return;
        }

        const providerData = auth.currentUser!.providerData[0];
        const photoURL = await getPhotoURL(providerData);

        const newEvent: Event = {
            id: generateUuid(),
            title: titleInput.element.value,
            description: descriptionInput.element.value,
            attendanceData: values.map(day => ({
                date: Timestamp.fromDate(day.hour(0).minute(0).second(0).millisecond(0).toDate()),
                attendeesChoices: []
            })),
            creationDate: Timestamp.fromDate(now.toDate()),
            creator: { ...providerData, id: auth.currentUser!.uid, photoURL }
        };
        await onFormSubmit(newEvent);
        setSubmitting(false);
    };

    return <Box onSubmit={onSubmitClick}
        component='form'
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            m: 2
        }}
        noValidate autoComplete='off'
    >
        <TextField
            variant='outlined' id='title' label='Event title' required
            {...titleInput.element}
            InputProps={{
                startAdornment: (<EventNote sx={{ color: 'action.active', mr: 1, my: 0.5 }} />)
            }}
            sx={{width: '100px'}}
        />

        <TextField multiline variant='outlined' id='description' label='Event Description' {...descriptionInput.element} minRows={3} />

        <MultipleDatesPicker inputFormat='DD/MM/YYYY' minDate={now} values={values} setValues={setValues} />

        <Button variant='contained' type='submit' disabled={submitting}>Create event</Button>
    </Box>;
};

export default EventForm;