import { UserInfo } from 'firebase/auth';

import { Choice } from './Choice';

export type AttendingChoices = {
    attendee: UserInfo & { id: string };
    choices: Choice[];
};