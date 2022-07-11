import { FormEvent, useState } from 'react';

const useTextArea = <T>(initialValue: T) => {
    const [value, setValue] = useState<T>(initialValue);

    const onChange = (event: FormEvent<HTMLTextAreaElement>) => {
        setValue(event.currentTarget.value as unknown as T);
    };

    return { value, onChange };
};

export default useTextArea;