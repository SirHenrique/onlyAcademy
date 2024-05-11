import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feed from '../screens/feed';
import Chat from '../screens/chat';
import Profile from '../screens/profile';
import Notifications from '../screens/notifications';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Feed" component={Feed} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}