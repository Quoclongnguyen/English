import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import DailyVocabScreen from '../screens/app/DailyVocabScreen';
import FlashcardScreen from '../screens/app/FlashcardScreen';
import ReviewQuizScreen from '../screens/app/ReviewQuizScreen';
import { Word } from '../types';

export type MainStackParamList = {
  Tabs: undefined;
  DailyVocabScreen: undefined;
  FlashcardScreen: { words: Word[], isReviewMode?: boolean };
  ReviewQuizScreen: undefined;
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
    </Stack.Navigator>
  );
};

export default MainNavigator;
