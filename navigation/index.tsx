
	import { NavigationContainer } from "@react-navigation/native";
	import { createStackNavigator } from "@react-navigation/stack";

	import Overview from "../screens/overview";
	import Details from "../screens/details";

	export type RootStackParamList = {
		Overview: undefined;
		Details: { name: string };
	};

	const Stack = createStackNavigator<RootStackParamList>();

	export default function RootStack() {

		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Overview">
					<Stack.Screen name="Overview" component={Overview} />
					
				</Stack.Navigator>
			</NavigationContainer>
		);
	}

