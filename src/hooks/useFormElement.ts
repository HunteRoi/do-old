import { ChangeEventHandler, useState } from 'react';

const useFormElement = <TElement extends HTMLInputElement | HTMLTextAreaElement, TValue>(initialValue: TValue) => {
    const [value, setValue] = useState<TValue>(initialValue);
    const [error, setError] = useState<boolean | undefined>(undefined);

    const onChange: ChangeEventHandler<TElement> = (event) => {
        setValue(event.currentTarget.value as unknown as TValue);
    };

    return { element: { value, onChange, error }, setError };
};

export default useFormElement;