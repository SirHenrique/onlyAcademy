
	import { NavigationContainer } from "@react-navigation/native";
	import { createStackNavigator } from "@react-navigation/stack";
import Camera from "screens/camera";

	import Profile from "screens/profile";

	export type RootStackParamList = {
		Overview: undefined;
		Details: { name: string };
		Profile: { name: string};
		Camera: {name: string}
	};

	const Stack = createStackNavigator<RootStackParamList>();

	export default function RootStack() {

		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Camera" screenOptions={{ headerShown: false }}>
					<Stack.Screen name="Profile" component={Profile}  />
					<Stack.Screen name="Camera" component={Camera} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

