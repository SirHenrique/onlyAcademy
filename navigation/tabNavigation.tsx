import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from 'screens/feed';
import Profile from 'screens/profile';
import { View } from 'tamagui';

const Tab = createBottomTabNavigator()

export default function TabRoutes() {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Feed' component={Feed}></Tab.Screen>
            <Tab.Screen name='Profile' component={Profile}></Tab.Screen>
        </Tab.Navigator>
    )
}
