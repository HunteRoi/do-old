import { Navigate } from 'react-router-dom';
import ParticipationForm from '../components/ParticipationForm';

import getEvent from '../hooks/getEvent';
import { AttendanceData } from '../models';

const formatAttendeeChoice = (attendanceData: AttendanceData, index: number) => {
    return (<li key={index}>
        <p>{attendanceData.date.toDate().toString()}</p>
        <ul>
            {attendanceData.attendeesChoices.map((attendeeChoice, index) =>
                attendeeChoice.status !== null && <li key={index}>{attendeeChoice.attendee.displayName} ({attendeeChoice.attendee.providerId}) - {attendeeChoice.status}</li>
            )}
        </ul>
    </li>);
};

const EventPage: React.FC = () => {
    const { event, loading, updateAttendance } = getEvent();

    if (loading) return <p>Loading...</p>;
    if (!event) return <Navigate to='/' />;

    return <>
        <h1>Event</h1>
        <p>Id: {event.id}</p>
        <p>Title: {event.title}</p>
        <p>Description: {event.description}</p>
        <ul>
            {event.attendanceData.map(formatAttendeeChoice)}
        </ul>
        <ParticipationForm acceptedDatesInMilliseconds={event.attendanceData.map(data => data.date.toDate().setHours(0,0,0,0))} onFormSubmit={updateAttendance}/>
    </>;
};

export default EventPage;