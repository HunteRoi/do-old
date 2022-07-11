import { AttendeeChoices } from './AttendeeChoices';

export type Event = {
    id: string;
    title: string;
    description?: string;
    selectedDates: Date[];
    attendeesChoices: AttendeeChoices[];
};
