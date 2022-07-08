import { UserInfo } from 'firebase/auth';
import { Choice } from './Choice';

export type AttendeeChoices = {
    attendee: UserInfo;
    choices: Choice[];
};
