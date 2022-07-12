import { UserInfo } from 'firebase/auth';
import { DateStatus as ChoiceStatus } from './DateStatus';

export type AttendeeChoices = {
    attendee: UserInfo;
    status: ChoiceStatus;
};