import { UserInfo } from 'firebase/auth';

import { Choice } from './Choice';

export type AttendingChoices = {
    id: string;
    attendee: UserInfo & { id: string };
    choices: Choice[];
};