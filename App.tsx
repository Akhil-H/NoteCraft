import React, { useState, useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ModernHome from './screens/ModernHome';
import LuminaDesign from './screens/LuminaDesign';

const App = () => {
  const [currentView, setCurrentView] = useState<'home' | 'lesson'>('home');
  const [selectedTopic, setSelectedTopic] = useState({ subject: '', lesson: '' });

  // Animation value
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSelectSubject = (subject: string, lesson: string) => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setSelectedTopic({ subject, lesson });
      setCurrentView('lesson');
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleBack = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentView('home');
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          {currentView === 'home' ? (
            <ModernHome
              userName="Scholar"
              onSelectSubject={handleSelectSubject}
              studyTime={1250}
              onLogout={() => console.log('Logout pressed')}
            />
          ) : (
            <LuminaDesign
              subject={selectedTopic.subject}
              lessonNumber={selectedTopic.lesson}
              onBack={handleBack}
              onTimeUpdate={(seconds) => console.log(`Studied for ${seconds}s`)}
            />
          )}
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
