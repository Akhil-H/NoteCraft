import { useState, useEffect } from 'react';

export interface LessonContent {
    subject: string;
    lessonNumber: string;
    title: string;
    sections: {
        header: string;
        body: string;
        color: string;
        bodyColor?: string;
    }[];
}

export interface QuizContent {
    questions: {
        question: string;
        options: string[];
        correctAnswer: number;
    }[];
}

export const useLessonController = (subject: string, lessonNumber: string) => {
    const [lesson, setLesson] = useState<LessonContent | null>(null);
    const [quiz, setQuiz] = useState<QuizContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = () => {
        setLoading(true);
        // Faster simulated API fetch for better UX
        setTimeout(() => {
            if (subject.toUpperCase() === 'BIOLOGY') {
                setLesson({
                    subject: 'BIOLOGY',
                    lessonNumber: 'Lesson 01',
                    title: 'The Human Heart',
                    sections: [
                        {
                            header: '',
                            color: '#38BDF8',
                            body: 'The heart is a muscular organ about the size of a fist, located just behind and slightly to the left of the breastbone.',
                            bodyColor: '#232123'
                        },
                        {
                            header: 'Some topic',
                            color: '#8B5CF6',
                            body: 'The heart is located in the chest cavity, just behind and slightly to the left of the breastbone.',
                            bodyColor: '#475569'
                        }
                    ]
                });
                setQuiz({
                    questions: [
                        {
                            question: 'Where is the heart located?',
                            options: ['Abdomen', 'Chest cavity', 'Head', 'Legs'],
                            correctAnswer: 1
                        }
                    ]
                });
            } else {
                setLesson({
                    subject: subject.toUpperCase(),
                    lessonNumber: lessonNumber || 'Lesson 01',
                    title: `${subject} Explorations`,
                    sections: [
                        {
                            header: 'Introduction',
                            color: '#6366F1',
                            body: `Welcome to the study of ${subject}. This module explores the fundamental principles and modern applications of the field.`,
                            bodyColor: '#AAB8C2'
                        }
                    ]
                });
                setQuiz({
                    questions: [
                        {
                            question: `Is ${subject} a branch of science?`,
                            options: ['Yes', 'No', 'Maybe', 'N/A'],
                            correctAnswer: 0
                        }
                    ]
                });
            }
            setLoading(false);
        }, 300);
    };

    useEffect(() => {
        refresh();
    }, [subject, lessonNumber]);

    return {
        lesson,
        quiz,
        loading,
        error,
        refresh,
    };
};
