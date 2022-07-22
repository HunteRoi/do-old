import { UserInfo } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

import { AttendanceData } from './AttendanceData';

export type Event = {
    id: string;
    title: string;
    description?: string | null;
    attendanceData: AttendanceData[];
    creationDate: Timestamp;
    creator: UserInfo & { id: string };
};
