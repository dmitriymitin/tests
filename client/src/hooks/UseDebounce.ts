import {useEffect, useState} from 'react';

function UseDebounce<T>(value: T, delay: number): [T, boolean] {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
            setIsLoading(false);
        }, delay);

        return () => {
            clearTimeout(timeout);
        };
    }, [value, delay]);

    return [debouncedValue, isLoading];
}

export default UseDebounce;
