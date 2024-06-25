import './translation';

import "react-native-gesture-handler";

	import React, { useEffect, useState } from "react";
	import { TamaguiProvider } from 'tamagui';
	import * as SplashScreen from 'expo-splash-screen';
	import { useFonts } from 'expo-font';

	import config from './tamagui.config'

	SplashScreen.preventAutoHideAsync();


import RootStack from "./navigation";
import { Session } from '@supabase/supabase-js';
import { supabase } from 'lib/supabase';

export default function App() {
	
		const [loaded] = useFonts({
			Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
			InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
		});

		const [session, setSession] = useState<Session | null>(null)

		
		useEffect(() => {
			supabase.auth.getSession().then(({ data: { session } }) => {
				setSession(session)
			  })
		  
			supabase.auth.onAuthStateChange((_event, session) => {
				setSession(session)
			})
			if (loaded) {
				SplashScreen.hideAsync();
			}
		}, [loaded])

		if (!loaded) {
			return null;
		}

		return (
			<TamaguiProvider defaultTheme='light' config={config}>
				<RootStack />
			</TamaguiProvider>
		);
	
}
