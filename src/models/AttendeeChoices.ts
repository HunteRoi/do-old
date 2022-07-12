import { UserInfo } from 'firebase/auth';
import { ChoiceStatus } from './ChoiceStatus';

export type AttendeeChoices = {
    attendee: UserInfo;
    status: ChoiceStatus;
};