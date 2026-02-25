import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants/theme';
import { useHomeController } from '../controllers/useHomeController';

const { width } = Dimensions.get('window');

interface ModernHomeProps {
    userName?: string;
    onSelectSubject?: (subject: string, lessonNumber: string) => void;
    studyTime?: number;
    onLogout?: () => void;
}

const ModernHome: React.FC<ModernHomeProps> = ({ userName = 'Scholar', onSelectSubject, studyTime = 0, onLogout }) => {
    const insets = useSafeAreaInsets();
    const { lessons, loading, error, refresh } = useHomeController();

    const formatTime = (seconds: number) => {
        if (seconds === 0) return "0m";
        const mins = Math.floor(seconds / 60);
        return mins > 0 ? `${mins}m ${seconds % 60}s` : `${seconds}s`;
    };

    const getSubjectConfig = (name: string) => {
        const normalized = name.toUpperCase();
        switch (normalized) {
            case 'BIOLOGY': return { icon: '🧬', color: '#10B981', gradient: '#D1FAE5' };
            case 'PHYSICS': return { icon: '⚛️', color: '#6366F1', gradient: '#E0E7FF' };
            case 'CHEMISTRY': return { icon: '🧪', color: '#F43F5E', gradient: '#FFE4E6' };
            case 'MATHS': return { icon: '📐', color: '#F59E0B', gradient: '#FEF3C7' };
            default: return { icon: '📚', color: '#64748B', gradient: '#F1F5F9' };
        }
    };

    return (
        <View style={styles.root}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <View style={[styles.topBar, { paddingTop: insets.top + SPACING.md }]}>
                <View>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.userName}>{userName}</Text>
                </View>
                <TouchableOpacity onPress={onLogout} style={styles.exitBtn}>
                    <Text style={styles.exitText}>Exit</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={loading && lessons.length > 0} onRefresh={refresh} tintColor={COLORS.primary} />
                }
            >
                <View style={styles.statsPanel}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLine}>Focus Time</Text>
                        <Text style={styles.statMain}>{formatTime(studyTime)}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statLine}>Lessons</Text>
                        <Text style={styles.statMain}>{lessons.length}</Text>
                    </View>
                </View>

                <Text style={styles.sectionHeader}>Mastery Tracks</Text>

                {loading && lessons.length === 0 ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loaderText}>Syncing content...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Unable to sync tracks. Please check connection.</Text>
                        <TouchableOpacity onPress={refresh} style={styles.retryBtn}>
                            <Text style={styles.retryText}>Retry Sync</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.grid}>
                        {lessons.map((lesson, i) => {
                            const config = getSubjectConfig(lesson.subject);
                            return (
                                <TouchableOpacity
                                    key={lesson._id || i}
                                    style={styles.card}
                                    onPress={() => onSelectSubject?.(lesson.subject, lesson.lessonNumber)}
                                    activeOpacity={0.9}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: config.gradient }]}>
                                        <Text style={styles.icon}>{config.icon}</Text>
                                    </View>
                                    <View style={styles.cardContent}>
                                        <Text style={[styles.subject, { color: config.color }]}>{lesson.subject}</Text>
                                        <Text style={styles.lessonNum}>{lesson.lessonNumber}</Text>
                                        <Text style={styles.lessonTitle} numberOfLines={2}>{lesson.title}</Text>
                                    </View>
                                    <View style={styles.cardFooter}>
                                        <Text style={styles.startText}>Begin Exploring</Text>
                                        <Text style={styles.arrow}>→</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    topBar: {
        paddingHorizontal: SPACING.xl,
        paddingBottom: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
    },
    greeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    userName: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.white,
    },
    exitBtn: {
        backgroundColor: 'rgba(244,63,94,0.1)',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.md,
    },
    exitText: {
        fontSize: 13,
        fontWeight: '800',
        color: COLORS.error,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: SPACING.xl,
        paddingBottom: SPACING.xxl,
    },
    statsPanel: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
    },
    statLine: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statMain: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.primary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: COLORS.border,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: SPACING.lg,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: SPACING.md,
    },
    card: {
        width: '47%',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: COLORS.black,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    icon: {
        fontSize: 24,
    },
    cardContent: {
        flex: 1,
    },
    subject: {
        fontSize: 11,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    lessonNum: {
        fontSize: 11,
        color: COLORS.textSecondary,
        fontWeight: '700',
        marginBottom: SPACING.xs,
    },
    lessonTitle: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '700',
        minHeight: 40,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.md,
        paddingTop: SPACING.sm,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    startText: {
        fontSize: 10,
        fontWeight: '800',
        color: COLORS.primary,
        textTransform: 'uppercase',
    },
    arrow: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '900',
    },
    loaderContainer: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    loaderText: {
        marginTop: SPACING.md,
        color: COLORS.textSecondary,
        fontWeight: '600',
    },
    errorContainer: {
        padding: SPACING.xl,
        alignItems: 'center',
        backgroundColor: 'rgba(244,63,94,0.05)',
        borderRadius: BORDER_RADIUS.lg,
    },
    errorText: {
        color: COLORS.error,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 20,
    },
    retryBtn: {
        marginTop: SPACING.md,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    retryText: {
        color: COLORS.error,
        fontWeight: '700',
    }
});

export default ModernHome;
