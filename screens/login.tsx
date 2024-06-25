import React, { useState } from 'react'
import { Alert, StyleSheet} from 'react-native'
import { supabase } from '../lib/supabase'
import { Keyboard, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { Button, Image, Input, Label, View } from 'tamagui';
import Constants from 'expo-constants';
import { RootStackParamList } from 'navigation';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { Session } from '@supabase/supabase-js';

type LoginSreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const navigation: any = useNavigation();

  async function signInWithEmail() {
    setLoading(true)
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      Alert.alert(error.message)
      setLoading(false)
      return
    }

    // Obter a sessão atualizada
    const { data: sessionData } = await supabase.auth.getSession()
    setSession(sessionData?.session)
    setLoading(false)
    if (sessionData?.session) {
      const { data: profileData, error: profileError, status } = await supabase
        .from('profile')
        .select('*')
        .eq('id', sessionData.session.user.id)
      console.log(sessionData.session.user.id)
      console.log(status)
      console.log(error)
      if (profileError && status !== 400) {
        Alert.alert(profileError.message)
      } else if (profileData && profileData.length === 0 ) {
        console.log(sessionData.session.user)
        navigation.navigate('CreateProfile')
      } else {
        console.log(JSON.stringify(profileData))
        navigation.navigate('Home')
      }
    } else {
      Alert.alert('Sessão inválida. Por favor, tente novamente.')
    }
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Por favor, verifique sua caixa de email!')
    setLoading(false)
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View flex={1} >
        <View backgroundColor='#007AA2' height={Constants.statusBarHeight} />
        <StatusBar
          barStyle='light-content'
          backgroundColor='#007AA2'
          translucent
        />

        <View flex={1} paddingHorizontal={24} alignItems='center'   >
          <View marginBottom={80} marginTop={124} width='400'>
          </View>
          <View gap={15} width='100%'>
            <View>
              <Label fontWeight={'bold'}>Login</Label>
              <Input borderColor="$appPrimary50" onChangeText={setEmail}  focusStyle={{ borderColor: "$appPrimary50" }} size="$5" id="email" />
            </View>
            <View>

              <Label fontWeight={'bold'}>Senha</Label>
              <Input onChangeText={setPassword} borderColor="$appPrimary50" secureTextEntry={true}
                focusStyle={{ borderColor: "$appPrimary50" }} size="$5" id="password" />
            </View>

            <View>
              <Button onPress={signInWithEmail} color="#fff" size="$5" backgroundColor="$appPrimary50" pressStyle={{ backgroundColor: "$appSecondary100" }} >Logar</Button>
            </View>
            
            <View>
              <Button onPress={signUpWithEmail} color="#fff" size="$5" backgroundColor="$appPrimary50" pressStyle={{ backgroundColor: "$appSecondary100" }} >Criar Conta</Button>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
