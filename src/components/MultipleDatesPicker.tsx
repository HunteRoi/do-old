import { TextField } from '@mui/material';
import { PickersDayProps, PickersDay, StaticDatePicker, StaticDatePickerProps } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

type MultipleDatesPickerProps<TDate> = {
    values: TDate[];
    setValues: React.Dispatch<React.SetStateAction<TDate[]>>;
} & Omit<StaticDatePickerProps<dayjs.Dayjs[], dayjs.Dayjs>, 'value' | 'onChange' | 'renderInput'>;

const MultipleDatesPicker: React.FC<MultipleDatesPickerProps<dayjs.Dayjs>> = ({ values, setValues, ...rest }) => {
    const renderPickerDay = (date: dayjs.Dayjs, _: dayjs.Dayjs[], pickersDayProps: PickersDayProps<dayjs.Dayjs>) => {
        if (!values) return <PickersDay {...pickersDayProps} />

        const selected = values.find(d => d.valueOf() === date.valueOf());
        return <PickersDay {...pickersDayProps} disableMargin selected={selected !== undefined} />;
    };

    return <StaticDatePicker<dayjs.Dayjs[], dayjs.Dayjs>
        {...rest}
        displayStaticWrapperAs='desktop'
        label='Day Picker'
        value={values}
        onChange={(newDate: dayjs.Dayjs | null) => {
            if (newDate === null) return;

            const dates = [...values];
            const date = newDate.hour(0).minute(0).second(0).millisecond(0);

            const index = dates.findIndex(d => d.valueOf() === date.valueOf());
            if (index === -1) dates.push(date);
            else dates.splice(index, 1);

            setValues(dates);
        }}
        renderDay={renderPickerDay}
        renderInput={(params) => <TextField {...params} />}
    />;
};

export default MultipleDatesPicker;
