import { useState, useEffect } from 'react';

export interface Lesson {
    _id: string;
    subject: string;
    lessonNumber: string;
    title: string;
}

export const useHomeController = () => {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = () => {
        setLoading(true);
        // Faster simulated API fetch for better UX
        setTimeout(() => {
            setLessons([
                { _id: '1', subject: 'Biology', lessonNumber: 'Lesson 01', title: 'Cell Structure and Function' },
                { _id: '2', subject: 'Physics', lessonNumber: 'Lesson 02', title: 'Newtonian Mechanics' },
                { _id: '3', subject: 'Chemistry', lessonNumber: 'Lesson 03', title: 'Chemical Bonding' },
                { _id: '4', subject: 'Maths', lessonNumber: 'Lesson 04', title: 'Differential Calculus' },
            ]);
            setLoading(false);
        }, 400);
    };

    useEffect(() => {
        refresh();
    }, []);

    return {
        lessons,
        loading,
        error,
        refresh,
    };
};
