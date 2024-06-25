
	import { NavigationContainer } from "@react-navigation/native";
	import { createStackNavigator } from "@react-navigation/stack";
	import Camera from "screens/camera";
	import CreateProfile from "screens/createProfile";
	import Feed from "screens/feed";
	import ImageScreen from "screens/imageScreen";
	import Login from "screens/login";
	import Pagamento from "screens/pagamento";
	import Profile from "screens/profile";
	import Publication from "screens/publication";
	import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import { View } from "tamagui";

	export type RootStackParamList = {
		Overview: undefined;
		Details: { name: string };
		Profile: { name: string};
		Camera: {name: string};
		Pagamento: {name: string};
		Login: {name: string};
		CreateProfile: {name: string};
		Feed: {name: string};
		ImageScreen: {name: string};
		Publication: {name: string};
		Home: {name: string}
	};

	const Stack = createStackNavigator<RootStackParamList>();
	const Tab = createBottomTabNavigator();

	export default function RootStack() {

		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Profile" component={Profile}  />
					<Stack.Screen name="CreateProfile" component={CreateProfile} />
					<Stack.Screen name="Camera" component={Camera} />
					<Stack.Screen name="Pagamento" component={Pagamento} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name='Home' > 
					{() => (
            <Tab.Navigator screenOptions={{
              tabBarStyle: {
                borderTopWidth: 0
              },
              tabBarActiveTintColor: '#007AA2',
			  
            }}>
              <Tab.Screen name='Feed' options={{
                headerShown: false, tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'home' : 'home-outline'}

                    size={32}
                    color={color}

                  />
                ),
              }} component={Feed} ></Tab.Screen>





<Tab.Screen name='Profile' options={{
                headerShown: false, tabBarIcon: ({ color, focused }) => (
                  <Ionicons
                    name={focused ? 'menu' : 'menu-outline'}

                    size={32}
                    color={color}

                  />
                ),
              }} component={Profile} ></Tab.Screen>
            </Tab.Navigator>
          )}
					</Stack.Screen>
					<Stack.Screen name="ImageScreen" component={ImageScreen} />
					
					<Stack.Screen name="Publication" // @ts-ignore 
					component={Publication} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

