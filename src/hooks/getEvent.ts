import { doc, getFirestore, onSnapshot, updateDoc, CollectionReference, collection, deleteDoc } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { AttendanceData, AttendingChoices, Choice, Event } from '../models';

function getDateAsMilliseconds(data: AttendanceData | Choice) {
    return data.date.toDate().setHours(0, 0, 0, 0);
};

type GetEventReturnType = {
    event: Event | null,
    loading: boolean,
    updateAttendance: (data: AttendingChoices, shouldDelete: boolean) => Promise<void>,
    deleteEvent: () => Promise<void>
};

const getEvent = (): GetEventReturnType => {
    const navigate = useNavigate();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const db = getFirestore();

    const updateAttendance = useMemo(() => async (data: AttendingChoices, shouldDelete: boolean = false) => {
        if (!event) return;
        const docRef = doc(db, 'events', event.id);
        const attendanceData = [...event.attendanceData];
        let attendees: string[] = [];
        for (const attendance of attendanceData) {
            const choiceForDate = data.choices.filter(c => getDateAsMilliseconds(c) === getDateAsMilliseconds(attendance))[0];
            const index = attendance.attendeesChoices.findIndex(ac => ac.attendee.id === data.attendee.id);

            if (index === -1) attendance.attendeesChoices.push({ attendee: data.attendee, id: data.id, status: choiceForDate?.status ?? null });
            else if (shouldDelete) attendance.attendeesChoices.splice(index, 1);
            else attendance.attendeesChoices[index].status = choiceForDate?.status ?? null;

            attendees = [...new Set(attendance.attendeesChoices.map(ac => ac.id))];
        }

        try {
            await updateDoc(docRef, 'attendanceData', attendanceData);
            await updateDoc(docRef, 'attendees', attendees);
        }
        catch (err) {
            console.error(err);
            navigate('/');
        }
    }, [event]);

    const deleteEvent = useMemo(() => async () => {
        if (!event) return;
        const docRef = doc(db, 'events', event.id);
        try {
            await deleteDoc(docRef);
        }
        catch (err) {
            console.error(err);
            navigate('/');
        }
    }, [event]);

    useEffect(() => {
        if (!params.id) return;
        const events = collection(db, 'events') as CollectionReference<Event>;
        const docRef = doc<Event>(events, params.id);
        return onSnapshot(docRef, snapshot => {
            if (!snapshot || !snapshot.data()) return setLoading(false);

            setEvent(snapshot.data() ?? null);
            setLoading(false);
        });
    }, [params]);

    return { event, loading, updateAttendance, deleteEvent };
};

export default getEvent;