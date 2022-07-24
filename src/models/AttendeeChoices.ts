import { UserInfo } from 'firebase/auth';

import { ChoiceStatus } from './ChoiceStatus';

export type AttendeeChoices = {
    id: string;
    attendee: UserInfo & { id: string };
    status: ChoiceStatus;
};