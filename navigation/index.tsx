
	import { NavigationContainer } from "@react-navigation/native";
	import { createStackNavigator } from "@react-navigation/stack";
	import Profile from "screens/profile";

	export type RootStackParamList = {
		Overview: undefined;
		Details: { name: string };
		Profile: { name: string}
	};

	const Stack = createStackNavigator<RootStackParamList>();

	export default function RootStack() {

		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Profile" component={Profile}  />
					
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

