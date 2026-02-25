import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const { width } = Dimensions.get('window');

interface LoginScreenProps {
    onLogin: (email: string) => void;
    onGoToSignup: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGoToSignup }) => {
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        onLogin(email || 'Scholar');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.inner, { paddingTop: insets.top + SPACING.xxl }]}>
                    <View style={styles.header}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>N</Text>
                        </View>
                        <Text style={styles.title}>Notecraft</Text>
                        <Text style={styles.subtitle}>Ignite your intelligence</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="name@domain.com"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <View style={styles.labelRow}>
                                <Text style={styles.label}>Password</Text>
                                <TouchableOpacity>
                                    <Text style={styles.forgotText}>Forgot?</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={COLORS.textSecondary}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.loginBtn}
                            onPress={handleLogin}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.loginBtnText}>Sign In</Text>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>New to Notecraft? </Text>
                            <TouchableOpacity onPress={onGoToSignup}>
                                <Text style={styles.signupText}>Create Account</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    inner: {
        flex: 1,
        paddingHorizontal: SPACING.xl,
        justifyContent: 'space-around',
        paddingBottom: SPACING.xxl,

    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    logoText: {
        fontSize: 40,
        fontWeight: '900',
        color: COLORS.white,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        fontWeight: '500',
    },
    form: {
        marginTop: SPACING.xxl,
    },
    inputGroup: {
        marginBottom: SPACING.xl,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.text,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        height: 56,
        paddingHorizontal: SPACING.md,
        color: COLORS.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    forgotText: {
        color: COLORS.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.md,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 5,
    },
    loginBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '800',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.xl,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 15,
        fontWeight: '500',
    },
    signupText: {
        color: COLORS.primary,
        fontSize: 15,
        fontWeight: '700',
    },
});

export default LoginScreen;
