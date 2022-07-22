import { getAuth } from 'firebase/auth';
import { Avatar, Typography } from '@mui/material';
import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { UserInfo } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

import { AttendanceData, AttendingChoices, ChoiceStatus, ChoiceStatusEnum } from '../models';
import ThreeStateCheckbox from './ThreeStateCheckbox';

type ParticipationFormProps = {
    attendanceData: AttendanceData[];
    onFormSubmit: (data: AttendingChoices) => Promise<void>
};

type AttendeeChoicesPerDate = {
    attendee: UserInfo,
    dateChoices: DateChoice[];
}

type DateChoice = { timestamp: Timestamp, choice: ChoiceStatus };

const ParticipationForm: React.FC<ParticipationFormProps> = ({ attendanceData }) => {
    const auth = getAuth();
    const columns = [
        {
            headerName: 'Attendees',
            field: 'attendee',
            renderCell: (params: GridRenderCellParams<UserInfo>) => (
                <>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} alt={params.value?.displayName ?? undefined} src={params.value?.photoURL ?? undefined} />
                    <Typography>{params.value?.displayName}</Typography>
                </>
            ),
            flex: .3,
            minWidth: 200
        },
        ...attendanceData
            .map(d => ({
                flex: .2,
                minWidth: 150,
                field: `${d.date.valueOf()}-choice`,
                renderHeader: () => (
                    <Typography>{dayjs(d.date.toDate()).format('DD/MM/YYYY')}</Typography>
                ),
                editable: true,
                renderCell: (params: GridRenderCellParams<ChoiceStatus>) => (
                    <ThreeStateCheckbox state={params.value} />
                ),
                valueOptions: [ChoiceStatusEnum.GOING, ChoiceStatusEnum.MAYBE, 'NONE'],
                type: 'singleSelect'
            }))
    ];

    const attendanceDataPerUser = attendanceData.reduce<Map<string, AttendeeChoicesPerDate>>((seed, current) => {
        for(const attendeeChoice of current.attendeesChoices) {
            if (seed.has(attendeeChoice.attendee.uid)) {
                seed.get(attendeeChoice.attendee.uid)!.dateChoices.push({
                    timestamp: current.date,
                    choice: attendeeChoice.status
                });
            } else {
                seed.set(attendeeChoice.attendee.uid, { attendee: attendeeChoice.attendee, dateChoices: [{ timestamp: current.date, choice: attendeeChoice.status }] });
            }
        }
        return seed;
    }, new Map());

    const rows = [
        ...[...attendanceDataPerUser.values()].map(data => {
            const row: any = { attendee: data.attendee, id: data.attendee.uid, editable: auth.currentUser?.uid === data.attendee.uid };
            for(const dateChoice of data.dateChoices) {
                row[`${dateChoice.timestamp.valueOf()}-choice`] = dateChoice.choice;
            }
            return row;
        })
    ];

    return <DataGrid
        autoHeight
        sx={{ width: '100%' }}
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
        rows={rows}
        editMode='row'
    />;
};

export default ParticipationForm;
