import { doc, getDoc, getFirestore, onSnapshot } from 'firebase/firestore';
import { UserInfo } from 'firebase/auth'
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AttendanceData, AttendeeChoices, Event } from '../models';

type GetEventReturnType = {
    event: Event | null,
    loading: boolean
};

const getEvent = (): GetEventReturnType => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [event, setEvent] = useState<Event | null>(null);

    useEffect(() => {
        if (!params.id) return;

        const db = getFirestore();
        const docRef = doc(db, 'events', params.id);
        return onSnapshot(docRef, async (snapshot) => {
            if (!snapshot || !snapshot.data()) return setLoading(false);

            const e: Event = { id: snapshot.data()!.id, title: snapshot.data()!.title, description: snapshot.data()!.description, attendanceData: [] };
            for (const attendanceData of snapshot.data()!.attendanceData) {
                const ad: AttendanceData = { date: attendanceData.date, attendeesChoices: [] };
                for (const choice of attendanceData.attendeesChoices) {
                    const attendee = await getDoc(doc(db, choice.attendee.path));
                    const ac: AttendeeChoices = { attendee: attendee.data() as UserInfo, status: choice.status };
                    ad.attendeesChoices.push(ac);
                }
                e.attendanceData.push(ad);
            }
            setEvent(e);
            setLoading(false);
        });
    }, [params]);

    return { event, loading };
};

export default getEvent;