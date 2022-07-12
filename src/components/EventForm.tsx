import { FormEvent, useState } from 'react';
import { v4 as generateUuid } from 'uuid';
import { Timestamp } from 'firebase/firestore';

import { Event } from '../models';
import useFormElement from '../hooks/useFormElement';

type EventFormProps = {
    onFormSubmit: (event: Event) => Promise<void>
};

const EventForm: React.FC<EventFormProps> = ({ onFormSubmit }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nowAsString = Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const titleInput = useFormElement<HTMLInputElement, string>('');
    const descriptionInput = useFormElement<HTMLTextAreaElement, string>('');;
    const date1Input = useFormElement<HTMLInputElement, string>(nowAsString);
    const date2Input = useFormElement<HTMLInputElement, string>(nowAsString);
    const [submitting, setSubmitting] = useState(false);

    const onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitting(true);

        const date1 = new Date(date1Input.value);
        date1.setHours(0, 0, 0, 0);
        const date2 = new Date(date2Input.value);
        date2.setHours(0, 0, 0, 0);

        if (!titleInput.value || date1 < now || date2 < now) {
            setSubmitting(false);
            return;
        }

        const newEvent: Event = {
            id: generateUuid(),
            title: titleInput.value,
            description: descriptionInput.value,
            attendanceData: [
                {
                    date: Timestamp.fromDate(date1),
                    attendeesChoices: []
                },
                {
                    date: Timestamp.fromDate(date2),
                    attendeesChoices: []
                }
            ],
        };
        await onFormSubmit(newEvent);
        setSubmitting(false);
    };

    return <form onSubmit={onSubmitClick}>
        <input type='text' placeholder='Event title' id='title' {...titleInput} required />
        <textarea id='description' placeholder='Event description' {...descriptionInput} />

        <div>
            <input type='date' id='date1' min={nowAsString} {...date1Input} required />
            <input type='date' id='date2' min={nowAsString} {...date2Input} required />
        </div>

        <input type='submit' disabled={submitting} />
    </form>;
};

export default EventForm;