import { Timestamp } from 'firebase/firestore';
import { AttendeeChoices } from './AttendeeChoices';

export type AttendanceData = {
    date: Timestamp;
    attendeesChoices: AttendeeChoices[];
};
