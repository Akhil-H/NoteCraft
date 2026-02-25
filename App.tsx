import React, { useState, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModernHome from './screens/ModernHome';
import LuminaDesign from './screens/LuminaDesign';
import LoginScreen from './screens/Login/LoginScreen';
import SignupScreen from './screens/Login/SignupScreen';

const App = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'home' | 'lesson'>('login');
  const [userName, setUserName] = useState('Scholar');
  const [selectedTopic, setSelectedTopic] = useState({ subject: '', lesson: '' });

  // Animation value
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const transitionTo = (view: 'login' | 'signup' | 'home' | 'lesson', callback?: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentView(view);
      if (callback) callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleLogin = (name?: string) => {
    setUserName(name || 'Scholar');
    transitionTo('home');
  };

  const handleSignup = (name?: string) => {
    setUserName(name || 'Scholar');
    transitionTo('home');
  };

  const handleSelectSubject = (subject: string, lesson: string) => {
    setSelectedTopic({ subject, lesson });
    transitionTo('lesson');
  };

  const handleLogout = () => {
    transitionTo('login');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onGoToSignup={() => transitionTo('signup')} />;
      case 'signup':
        return <SignupScreen onSignup={handleSignup} onGoToLogin={() => transitionTo('login')} />;
      case 'home':
        return (
          <ModernHome
            userName={userName}
            onSelectSubject={handleSelectSubject}
            studyTime={1250}
            onLogout={handleLogout}
          />
        );
      case 'lesson':
        return (
          <LuminaDesign
            subject={selectedTopic.subject}
            lessonNumber={selectedTopic.lesson}
            onBack={() => transitionTo('home')}
            onTimeUpdate={(seconds) => console.log(`Studied for ${seconds}s`)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {renderContent()}
        </Animated.View>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // Match theme background
  }
});

export default App;

