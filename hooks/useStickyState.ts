
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useStickyState<T>(defaultValue: T, key: string): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
        try {
            const stickyValue = window.localStorage.getItem(key);
            if (stickyValue !== null) {
                return JSON.parse(stickyValue);
            }
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
        }
        return defaultValue;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, value]);

    return [value, setValue];
}

export default useStickyState;
