import { FormEvent } from "react";
import { v4 as generateUuid } from 'uuid';

import { Event } from '../models';
import useInput from "../hooks/useInput";
import useTextArea from "../hooks/useTextArea";

const EventForm: React.FC = () => {
    const now = new Date();
    const titleInput = useInput('');
    const descriptionInput = useTextArea('');
    const date1Input = useInput(now.toISOString().split('T')[0]);
    const date2Input = useInput(now.toISOString().split('T')[0]);

    const onSubmitClick = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();

        const newEvent: Event = {
            id: generateUuid(),
            title: titleInput.value,
            description: descriptionInput.value,
            selectedDates: [
                new Date(date1Input.value),
                new Date(date2Input.value)
            ],
            attendeesChoices: []
        };
        console.log(newEvent);
    };

    return <form onSubmit={onSubmitClick}>
        <input type='text' placeholder='Event title' id='title' {...titleInput} />
        <textarea id='description' placeholder='Event description' {...descriptionInput} />

        <div>
            <input type='date' id='date1' {...date1Input} />
            <input type='date' id='date2' {...date2Input} />
        </div>

        <input type='submit' />
    </form>;
};

export default EventForm;