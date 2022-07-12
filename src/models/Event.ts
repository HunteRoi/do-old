import { AttendanceData } from './AttendanceData';

export type Event = {
    id: string;
    title: string;
    description?: string;
    attendanceData: AttendanceData[]
};
