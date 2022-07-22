import { useState } from 'react';

const useDateInput = <TValue>(initialValue: TValue) => {
    const [value, setValue] = useState<TValue>(initialValue);
    const [error, setError] = useState<boolean | undefined>(undefined);

    const onChange = (value: TValue) => {
        setValue(value);
    };

    return { element: { value, onChange, error }, setError };
};

export default useDateInput;