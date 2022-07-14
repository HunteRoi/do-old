import { UserInfo } from 'firebase/auth';

import { Choice } from './Choice';

export type AttendingChoices = {
    attendee: UserInfo;
    choices: Choice[];
};