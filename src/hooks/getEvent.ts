import { doc, getFirestore, onSnapshot, setDoc, CollectionReference, collection } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AttendanceData, AttendingChoices, Choice, Event } from '../models';

function getDateAsMilliseconds(data: AttendanceData | Choice) {
    return data.date.toDate().setHours(0, 0, 0, 0);
};

type GetEventReturnType = {
    event: Event | null,
    loading: boolean,
    updateAttendance: (data: AttendingChoices) => Promise<void>
};

const getEvent = (): GetEventReturnType => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);
    const db = getFirestore();

    const updateAttendance = useMemo(() => async (data: AttendingChoices) => {
        if (!event) return;
        const docRef = doc(db, 'events', event.id);
        const attendanceData = [...event.attendanceData];
        for (const attendance of attendanceData) {
            const choiceForDate = data.choices.filter(c => getDateAsMilliseconds(c) === getDateAsMilliseconds(attendance))[0];
            const index = attendance.attendeesChoices.findIndex(ac => ac.attendee.uid === data.attendee.uid);
            if (index === -1) attendance.attendeesChoices.push({ attendee: data.attendee, status: choiceForDate?.status ?? null });
            else attendance.attendeesChoices[index].status = choiceForDate?.status ?? null;
        }
        await setDoc(docRef, { attendanceData }, { merge: true });
    }, [event]);

    useEffect(() => {
        if (!params.id) return;
        const events = collection(db, 'events') as CollectionReference<Event>;
        const docRef = doc<Event>(events, params.id);
        return onSnapshot(docRef, async (snapshot) => {
            if (!snapshot || !snapshot.data()) return setLoading(false);

            setEvent(snapshot.data() ?? null);
            setLoading(false);
        });
    }, [params]);

    return { event, loading, updateAttendance };
};

export default getEvent;