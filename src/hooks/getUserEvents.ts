import { collection, CollectionReference, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import { Event } from '../models';

type GetUserEventsReturnType = {
    events: Event[],
    loading: boolean;
};

const getUserEvents = (id: string | null): GetUserEventsReturnType => {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const db = getFirestore();

    useEffect(() => {
        const getEvents = async () => {
            if (!id) return;
            setLoading(true);

            const evts = collection(db, 'events') as CollectionReference<Event>;
            const creatorConstraint = where('creator.id', '==', id);
            const attendeeConstraint = where('attendees', 'array-contains', id);

            const unsubscribeCreatorEvents = onSnapshot(query(evts, creatorConstraint), snapshot => {
                if (!snapshot || !snapshot.docs) return setLoading(false);

                const newEvents = [...snapshot.docs.map(doc => doc.data() as Event)];
                setEvents(previous => [...new Map([...previous, ...newEvents].map(e => [e.id, e])).values()]);
            });
            const unsubscribeAttendeeEvents = onSnapshot(query(evts, attendeeConstraint), snapshot => {
                if (!snapshot || !snapshot.docs) return setLoading(false);

                const newEvents = [...snapshot.docs.map(doc => doc.data() as Event)];
                setEvents(previous => [...new Map([...previous, ...newEvents].map(e => [e.id, e])).values()]);
            });
            setLoading(false);

            return () => {
                unsubscribeCreatorEvents();
                unsubscribeAttendeeEvents();
            }
        };

        getEvents();
    }, [id]);

    return { events, loading };
};

export default getUserEvents;