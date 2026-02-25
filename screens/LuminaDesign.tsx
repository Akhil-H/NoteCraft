import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ActivityIndicator,
    Animated,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLessonController } from '../controllers/useLessonController';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

interface LuminaDesignProps {
    subject: string;
    lessonNumber: string;
    onBack?: () => void;
    onTimeUpdate?: (seconds: number) => void;
}

const LuminaDesign: React.FC<LuminaDesignProps> = ({ subject, lessonNumber, onBack, onTimeUpdate }) => {
    const insets = useSafeAreaInsets();
    const [step, setStep] = useState<'reading' | 'quiz' | 'score'>('reading');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [userAnswers, setUserAnswers] = useState<number[]>([]);
    const [score, setScore] = useState(0);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const { lesson, quiz, loading, error, refresh } = useLessonController(subject, lessonNumber);

    useEffect(() => {
        const startTime = Date.now();
        return () => {
            const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
            if (onTimeUpdate) onTimeUpdate(durationSeconds);
        };
    }, []);

    useEffect(() => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true })
        ]).start();
    }, [step]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
        const total = contentSize.height - layoutMeasurement.height;
        if (total <= 0) { setScrollProgress(1); return; }
        setScrollProgress(Math.min(Math.max(contentOffset.y / total, 0), 1));
    };

    const handleAnswerSelect = (optIndex: number) => {
        const newUserAnswers = [...userAnswers];
        newUserAnswers[currentQuestion] = optIndex;
        setUserAnswers(newUserAnswers);
    };

    const handleSubmitQuiz = () => {
        if (!quiz?.questions) return;
        const correctCount = quiz.questions.reduce((acc: number, q: any, i: number) =>
            acc + (userAnswers[i] === q.correctAnswer ? 1 : 0), 0);
        setScore(correctCount);
        setStep('score');
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Unlocking Knowledge...</Text>
            </View>
        );
    }

    if (error || !lesson) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>⚠️ Failed to decode content</Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={refresh}>
                    <Text style={styles.btnText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onBack} style={styles.ghostBtn}>
                    <Text style={styles.ghostBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const quizData = quiz?.questions || [];
    const currentQData = quizData[currentQuestion];

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
                <TouchableOpacity onPress={onBack} style={styles.backCircle}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerLabel}>{subject}</Text>
                    <Text style={styles.headerMain}>
                        {step === 'reading' ? 'Content' : step === 'quiz' ? 'Assessment' : 'Performance'}
                    </Text>
                </View>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${(step === 'reading' ? scrollProgress : (currentQuestion + 1) / quizData.length) * 100}%` }]} />
                </View>
            </View>

            <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {step === 'reading' ? (
                    <View style={styles.contentWrapper}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            onScroll={handleScroll}
                            scrollEventThrottle={16}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Text style={styles.lessonId}>{lesson.lessonNumber}</Text>
                            <Text style={styles.lessonTitle}>{lesson.title}</Text>

                            {lesson.sections.map((section: any, index: number) => (
                                <View key={index} style={styles.section}>
                                    <View style={[styles.sectionMarker, { backgroundColor: section.color || COLORS.primary }]} />
                                    <Text style={[styles.sectionHeader, { color: section.color || COLORS.white }]}>{section.header}</Text>
                                    <Text style={[styles.sectionBody, section.bodyColor ? { color: section.bodyColor } : {}]}>{section.body}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {quizData.length > 0 && (
                            <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('quiz')}>
                                <Text style={styles.btnText}>Launch Quiz</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : step === 'quiz' && currentQData ? (
                    <View style={styles.quizWrapper}>
                        <View style={styles.qHeader}>
                            <Text style={styles.qCount}>QUESTION {currentQuestion + 1} OF {quizData.length}</Text>
                            <Text style={styles.qText}>{currentQData.question}</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} style={styles.optionsScroll}>
                            {currentQData.options.map((opt: string, i: number) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[styles.optBtn, userAnswers[currentQuestion] === i && styles.selectedOptBtn]}
                                    onPress={() => handleAnswerSelect(i)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.optIndex, userAnswers[currentQuestion] === i && styles.selectedOptIndex]}>
                                        <Text style={[styles.optIndexText, userAnswers[currentQuestion] === i && styles.selectedOptIndexText]}>
                                            {String.fromCharCode(65 + i)}
                                        </Text>
                                    </View>
                                    <Text style={[styles.optText, userAnswers[currentQuestion] === i && styles.selectedOptText]}>{opt}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <View style={styles.quizFooter}>
                            <TouchableOpacity
                                style={[styles.primaryBtn, { opacity: userAnswers[currentQuestion] === undefined ? 0.5 : 1 }]}
                                disabled={userAnswers[currentQuestion] === undefined}
                                onPress={currentQuestion === quizData.length - 1 ? handleSubmitQuiz : () => setCurrentQuestion(c => c + 1)}
                            >
                                <Text style={styles.btnText}>
                                    {currentQuestion === quizData.length - 1 ? 'See Results' : 'Next Insight'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.scoreWrapper}>
                        <View style={styles.scoreCircle}>
                            <Text style={styles.scoreBig}>{Math.round((score / quizData.length) * 100)}%</Text>
                            <Text style={styles.scoreSmall}>{score} / {quizData.length} Correct</Text>
                        </View>

                        <Text style={styles.feedbackTitle}>
                            {score === quizData.length ? "Absolute Mastery!" : score > quizData.length / 2 ? "Solid Understanding!" : "Keep Practicing!"}
                        </Text>
                        <Text style={styles.feedbackSub}>
                            You've completed the curriculum for {lesson.lessonNumber}.
                        </Text>

                        <TouchableOpacity style={[styles.primaryBtn, { width: '80%' }]} onPress={onBack}>
                            <Text style={styles.btnText}>Complete Module</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
    header: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
    },
    backCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    backArrow: { fontSize: 20, color: COLORS.white, fontWeight: '700' },
    headerTitleContainer: { flex: 1, marginLeft: SPACING.md },
    headerLabel: { fontSize: 10, fontWeight: '900', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 2 },
    headerMain: { fontSize: 18, fontWeight: '800', color: COLORS.white },
    progressContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: COLORS.border },
    progressBar: { height: '100%', backgroundColor: COLORS.primary },
    container: { flex: 1 },
    contentWrapper: { flex: 1, padding: SPACING.xl },
    scrollContent: { paddingBottom: SPACING.xxl },
    lessonId: { fontSize: 12, fontWeight: '900', color: COLORS.textSecondary, letterSpacing: 1, marginBottom: 4 },
    lessonTitle: { fontSize: 32, fontWeight: '900', color: COLORS.white, marginBottom: SPACING.xl, lineHeight: 40 },
    section: { marginBottom: SPACING.xl, backgroundColor: COLORS.surface, padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, borderWidth: 1, borderColor: COLORS.border },
    sectionMarker: { width: 40, height: 4, borderRadius: 2, marginBottom: SPACING.md },
    sectionHeader: { fontSize: 20, fontWeight: '800', marginBottom: SPACING.sm },
    sectionBody: { fontSize: 16, lineHeight: 28, color: COLORS.textSecondary, fontWeight: '500' },
    primaryBtn: { backgroundColor: COLORS.primary, height: 64, borderRadius: BORDER_RADIUS.lg, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    btnText: { color: COLORS.white, fontSize: 18, fontWeight: '800' },
    quizWrapper: { flex: 1, padding: SPACING.xl },
    qHeader: { marginBottom: SPACING.xl },
    qCount: { fontSize: 11, fontWeight: '900', color: COLORS.primary, letterSpacing: 2, marginBottom: SPACING.sm },
    qText: { fontSize: 24, fontWeight: '800', color: COLORS.white, lineHeight: 32 },
    optionsScroll: { flex: 1 },
    optBtn: { backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border },
    selectedOptBtn: { borderColor: COLORS.primary, backgroundColor: 'rgba(99, 102, 241, 0.1)' },
    optIndex: { width: 36, height: 36, borderRadius: 10, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
    selectedOptIndex: { backgroundColor: COLORS.primary },
    optIndexText: { fontWeight: '800', color: COLORS.textSecondary },
    selectedOptIndexText: { color: COLORS.white },
    optText: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text },
    selectedOptText: { color: COLORS.white },
    quizFooter: { paddingTop: SPACING.md },
    scoreWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
    scoreCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: COLORS.surface, borderWidth: 10, borderColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xxl },
    scoreBig: { fontSize: 48, fontWeight: '900', color: COLORS.white },
    scoreSmall: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginTop: -4 },
    feedbackTitle: { fontSize: 28, fontWeight: '900', color: COLORS.white, textAlign: 'center', marginBottom: SPACING.sm },
    feedbackSub: { fontSize: 16, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xxl, lineHeight: 24 },
    loadingText: { marginTop: SPACING.md, color: COLORS.textSecondary, fontWeight: '700', fontSize: 16 },
    errorText: { color: COLORS.error, fontWeight: '800', fontSize: 18, marginBottom: SPACING.md },
    ghostBtn: { marginTop: SPACING.lg },
    ghostBtnText: { color: COLORS.textSecondary, fontWeight: '700' }
});

export default LuminaDesign;
