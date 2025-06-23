import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import MainMenu from './src/screens/MainMenu';
import GameLobby from './src/screens/GameLobby';
import GameScreen from './src/screens/GameScreen';
import Store from './src/screens/Store';
import Profile from './src/screens/Profile';
import Leaderboard from './src/screens/Leaderboard';
import Settings from './src/screens/Settings';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="GameLobby" component={GameLobby} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Store" component={Store} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
