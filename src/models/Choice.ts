import { Timestamp } from 'firebase/firestore';
import { ChoiceStatus } from './ChoiceStatus';

export type Choice = {
    date: Timestamp;
    status: ChoiceStatus;
};
