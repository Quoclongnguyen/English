import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import DailyVocabScreen from '../screens/app/DailyVocabScreen';
import FlashcardScreen from '../screens/app/FlashcardScreen';
import ReviewQuizScreen from '../screens/app/ReviewQuizScreen';
import CameraChecklistScreen from '../screens/app/CameraChecklistScreen';
import ListeningPlayerScreen from '../screens/app/ListeningPlayerScreen';
import ReadingScreen from '../screens/app/ReadingScreen';
import GrammarTopicListScreen from '../screens/app/GrammarTopicListScreen';
import GrammarTheoryScreen from '../screens/app/GrammarTheoryScreen';
import GrammarExerciseScreen from '../screens/app/GrammarExerciseScreen';
import { Word } from '../types';

export type MainStackParamList = {
  Tabs: undefined;
  DailyVocabScreen: undefined;
  FlashcardScreen: { words: Word[], isReviewMode?: boolean };
  ReviewQuizScreen: undefined;
  CameraChecklistScreen: undefined;
  ListeningPlayerScreen: undefined;
  ReadingScreen: undefined;
  GrammarTopicListScreen: undefined;
  GrammarTheoryScreen: { topicId: string };
  GrammarExerciseScreen: { topicId: string };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={AppNavigator} />
      <Stack.Screen name="DailyVocabScreen" component={DailyVocabScreen} />
      <Stack.Screen 
        name="FlashcardScreen" 
        component={FlashcardScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen 
        name="ReviewQuizScreen" 
        component={ReviewQuizScreen} 
        options={{ presentation: 'fullScreenModal' }}
      />
      <Stack.Screen
        name="CameraChecklistScreen"
        component={CameraChecklistScreen}
      />
      <Stack.Screen
        name="ListeningPlayerScreen"
        component={ListeningPlayerScreen}
      />
      <Stack.Screen name="ReadingScreen" component={ReadingScreen} />
      <Stack.Screen name="GrammarTopicListScreen" component={GrammarTopicListScreen} />
      <Stack.Screen name="GrammarTheoryScreen" component={GrammarTheoryScreen} />
      <Stack.Screen name="GrammarExerciseScreen" component={GrammarExerciseScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
