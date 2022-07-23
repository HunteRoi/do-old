import { getAuth, UserInfo } from 'firebase/auth';
import { Avatar, Button, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridEventListener, GridRenderCellParams, GridRowId, GridRowModel, GridRowModes, GridRowModesModel, GridRowParams, GridRowsProp, GridToolbarContainer, MuiEvent } from '@mui/x-data-grid';
import { Add, Cancel, Delete, Edit, Save } from '@mui/icons-material';
import { Timestamp } from 'firebase/firestore';
import dayjs from 'dayjs';

import { AttendanceData, AttendingChoices, Choice, ChoiceStatus, ChoiceStatusEnum } from '../models';
import ThreeStateCheckbox from './ThreeStateCheckbox';
import React, { useEffect, useState } from 'react';
import getPhotoURL from '../hooks/getPhotoURL';

type ParticipationFormProps = {
    attendanceData: AttendanceData[];
    onFormSubmit: (data: AttendingChoices, shouldDelete: boolean) => Promise<void>
};

type AttendeeChoicesPerDate = {
    attendee: UserInfo & { id: string },
    dateChoices: DateChoice[];
}

type DateChoice = { timestamp: Timestamp, choice: ChoiceStatus };

type EditToolbarProps = {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void,
    setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void
};

const ParticipationForm: React.FC<ParticipationFormProps> = ({ attendanceData, onFormSubmit }) => {
    const auth = getAuth();
    const [rows, setRows] = useState<GridRowsProp[]>([]);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
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
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            getActions: (props: any) => {
                const { id } = props;
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

                if (isInEditMode) {
                    return [
                        <GridActionsCellItem icon={<Save />} label='Save' onClick={handleSaveClick(id)} color='inherit' />,
                        <GridActionsCellItem icon={<Cancel />} label='Cancel' onClick={handleCancelClick(id)} color='inherit' />,
                    ];
                }

                return [
                    <GridActionsCellItem
                        icon={<Edit />}
                        label='Edit'
                        onClick={handleEditClick(id)}
                        color='inherit'
                    />,
                    <GridActionsCellItem
                        icon={<Delete />}
                        label='Delete'
                        onClick={handleDeleteClick(id)}
                        color='inherit'
                    />,
                ];
            },
        },
        ...attendanceData
            .map(d => ({
                flex: .2,
                minWidth: 200,
                field: `${d.date.toMillis()}-choice`,
                renderHeader: () => (
                    <Typography>{dayjs(d.date.toDate()).format('dddd DD/MM/YYYY')}</Typography>
                ),
                editable: true,
                renderCell: (params: GridRenderCellParams<ChoiceStatus>) => (
                    <ThreeStateCheckbox state={params.value} />
                ),
                valueOptions: [{ value: ChoiceStatusEnum.GOING, label: 'Going' }, { value: ChoiceStatusEnum.MAYBE, label: 'Maybe' }, { value: ChoiceStatusEnum.NOT_GOING, label: 'Not going' }],
                type: 'singleSelect'
            }))
    ];
    const EditToolbar = (props: EditToolbarProps) => {
        const { setRows, setRowModesModel } = props;
        const handleClick = async () => {
            if (!auth || !auth.currentUser) return;

            const id = auth.currentUser.uid;
            const isNew = rows.every((row: any) => row.id !== id);

            if (isNew) {
                const providerData = auth.currentUser.providerData[0];
                const photoURL = await getPhotoURL(providerData);
                const attendee = { ...providerData, id, photoURL };

                const newRow: any = { id, attendee };
                for(const date of attendanceData.map(data => data.date)) {
                    newRow[`${date.toMillis()}-choice`] = ChoiceStatusEnum.NOT_GOING;
                }

                setRows((oldRows) => [...oldRows, newRow]);
            }
            setRowModesModel((oldModel) => ({ ...oldModel, [id]: { mode: GridRowModes.Edit }}));
        };

        return <GridToolbarContainer>
            <Button color='primary' startIcon={<Add />} onClick={handleClick}>Add</Button>
        </GridToolbarContainer>
    };
    const handleRowEditStart = (_: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
        event.defaultMuiPrevented = true;
    };
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (_, event) => {
        event.defaultMuiPrevented = true;
    };
    const processRowUpdate = (newRow: GridRowModel) => {
        setRows(rows.map((row: any) => (row.id === newRow.id) ? newRow : row));
        const choices: Choice[] = [];
        for(const prop in newRow) {
            if (!prop.endsWith('-choice')) continue;
            const unixTimestamp = parseInt(prop.split('-choice')[0]);
            const date = Timestamp.fromMillis(unixTimestamp);
            const status = newRow[prop] === '' ? null : newRow[prop];
            choices.push({ date, status });
        }
        onFormSubmit({ attendee: newRow.attendee, choices }, false);
        return newRow;
    };
    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    };
    const handleSaveClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };
    const handleDeleteClick = (id: GridRowId) => () => {
        const deletedRow: any = rows.find((row: any) => row.id === id);
        onFormSubmit({ attendee: deletedRow.attendee, choices: [] }, true);
        setRows(rows.filter((row: any) => row.id !== id));
    };
    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
        ...rowModesModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        const editedRow: any = rows.find((row: any) => row.id === id);
        if (editedRow?.isNew) {
            setRows(rows.filter((row: any) => row.id !== id));
        }
    };

    useEffect(() => {
        const attendanceDataPerUser = attendanceData.reduce<Map<string, AttendeeChoicesPerDate>>((seed, current) => {
            for(const attendeeChoice of current.attendeesChoices) {
                if (seed.has(attendeeChoice.attendee.id)) {
                    seed.get(attendeeChoice.attendee.id)!.dateChoices.push({
                        timestamp: current.date,
                        choice: attendeeChoice.status
                    });
                } else {
                    seed.set(attendeeChoice.attendee.id, { attendee: attendeeChoice.attendee, dateChoices: [{ timestamp: current.date, choice: attendeeChoice.status }] });
                }
            }
            return seed;
        }, new Map());

        setRows([
            ...[...attendanceDataPerUser.values()].map(data => {
                const row: any = { attendee: data.attendee, id: data.attendee.id, editable: true };
                for(const dateChoice of data.dateChoices) {
                    row[`${dateChoice.timestamp.toMillis()}-choice`] = dateChoice.choice;
                }
                return row;
            })
        ]);
    }, [attendanceData]);

    return <DataGrid
        autoHeight
        sx={{ width: '100%' }}
        experimentalFeatures={{ newEditingApi: true }}
        columns={columns}
        rows={rows}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
            Toolbar: EditToolbar,
        }}
        componentsProps={{
            toolbar: { setRows, setRowModesModel },
        }}
    />;
};

export default ParticipationForm;
