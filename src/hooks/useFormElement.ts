import { FormEvent, useState } from 'react';

const useFormElement = <TElement extends HTMLInputElement | HTMLTextAreaElement, TValue>(initialValue: TValue) => {
    const [value, setValue] = useState<TValue>(initialValue);

    const onChange = (event: FormEvent<TElement>) => {
        setValue(event.currentTarget.value as unknown as TValue);
    };

    return { value, onChange };
};

export default useFormElement;