import { FormEvent, useState } from 'react';

const useInput = <T>(initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);

    const onChange = (event: FormEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.value as unknown as T);
    };

    return { value, onChange };
};

export default useInput;