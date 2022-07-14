import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import { FormEvent, useState } from 'react';
import { facebookConfig } from '../config';

import useFormElement from '../hooks/useFormElement';
import { AttendingChoices, ChoiceStatus } from '../models';

type ParticipationFormProps = {
    acceptedDatesInMilliseconds: number[],
    onFormSubmit: (data: AttendingChoices) => Promise<void>
};

function isChoiceStatus(value: string | null): value is ChoiceStatus {
    return ['going', 'maybe', null].includes(value);
}

const ParticipationForm: React.FC<ParticipationFormProps> = ({ acceptedDatesInMilliseconds, onFormSubmit }) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nowAsString = Intl.DateTimeFormat('fr-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
    const date1Input = useFormElement<HTMLInputElement, string>(nowAsString);
    const choice1Input = useFormElement<HTMLInputElement, string>('');
    const date2Input = useFormElement<HTMLInputElement, string>(nowAsString);
    const choice2Input = useFormElement<HTMLInputElement, string>('');
    const [submitting, setSubmitting] = useState(false);
    const auth = getAuth();

    const onSubmitClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmitting(true);

        const date1 = new Date(date1Input.value);
        date1.setHours(0, 0, 0, 0);
        const date2 = new Date(date2Input.value);
        date2.setHours(0, 0, 0, 0);
        const choice1 = choice1Input.value || null;
        const choice2 = choice2Input.value || null;

        if (!isChoiceStatus(choice1) || !isChoiceStatus(choice2)
            || acceptedDatesInMilliseconds.filter(date => date === date1.valueOf()).length !== 1
            || acceptedDatesInMilliseconds.filter(date => date === date2.valueOf()).length !== 1
        ) {
            setSubmitting(false);
            return;
        }

        const providerData = auth.currentUser!.providerData[0];
        let photoURL = providerData.photoURL;
        if (providerData.providerId === 'facebook.com') {
            const token = `${facebookConfig.appId}|${facebookConfig.appSecret}`;
            const response = await fetch(`${photoURL}?access_token=${token}&redirect=0`);
            const json = await response.json();
            photoURL = json.data.url;
        }

        const attendanceData: AttendingChoices = {
            attendee:  { ...providerData, photoURL },
            choices: []
        };

        if (choice1) {
            attendanceData.choices.push({
                date: Timestamp.fromDate(date1),
                status: choice1
            })
        }
        if (choice2) {
            attendanceData.choices.push({
                date: Timestamp.fromDate(date2),
                status: choice2

            });
        }

        await onFormSubmit(attendanceData);
        setSubmitting(false);
    };

    return <form onSubmit={onSubmitClick}>
            <div>
                <input type='date' id='date1' {...date1Input} required />
                <input type='text' id='choice1' {...choice1Input} />
            </div>

            <div>
                <input type='date' id='date1' {...date2Input} required />
                <input type='text' id='choice2' {...choice2Input} />
            </div>

            <input type='submit' disabled={submitting}/>
    </form>;
};

export default ParticipationForm;