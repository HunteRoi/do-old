import { AttendeeChoices } from './AttendeeChoices';
import { TimeRange } from './TimeRange';

export type Event = {
    title: string;
    description?: string;
    timeRange: TimeRange;
    attendeesChoices: AttendeeChoices[];
};
