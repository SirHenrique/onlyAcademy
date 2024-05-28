import { RouteProp } from "@react-navigation/native";
import  { RootStackParamList } from "navigation";
import { useNavigation } from "@react-navigation/native";
import { StatusBar, TouchableOpacity } from "react-native";
import { View,Text } from "tamagui";
import Constants from 'expo-constants';
import { openBrowserAsync } from "expo-web-browser";
import { ACCESS_TOKEN } from "../config.json"

type PagamentoSreenRouteProp = RouteProp<RootStackParamList, 'Pagamento'>;
export default function Pagamento() {

    const navigation: any = useNavigation();

    const handleIntegracaoMensal = async() => {
        let preferencia = {
            reason: "Plano Mensal",
            auto_recurring: {
              frequency: 1,
              frequency_type: "months",
              billing_day: 10,
              billing_day_proportional: true,
              transaction_amount: 19,
              currency_id: "BRL"
            },
            payment_methods_allowed: {
              payment_types: [
                {
                    id: "account_money"
                },
                {
                    id: "credit_card"
                }
              ],
              payment_methods: [
                {}
              ]
            },
            back_url: "https://www.yoursite.com"
          }

        try {
            const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferencia)
            })
    
            const data = await response.json()
            openBrowserAsync(data.init_point)
            console.log(data)
            
        } catch (error) {
            console.log(error)
        }

    }

    const handleIntegracaoAnual = async() => {
        let preferencia = {
            reason: "Plano Anual",
            auto_recurring: {
              frequency: 12,
              frequency_type: "months",
              transaction_amount: 190,
              currency_id: "BRL"
            },
            payment_methods_allowed: {
              payment_types: [
                {
                    id: "account_money"
                },
                {
                    id: "credit_card"
                }
              ],
              payment_methods: [
                {}
              ]
            },
            back_url: "https://www.yoursite.com"
          }

        try {
            const response = await fetch('https://api.mercadopago.com/preapproval_plan', {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preferencia)
            })
    
            const data = await response.json()
            openBrowserAsync(data.init_point)
            console.log(data)
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <View flex={1} backgroundColor='#fff'>
        <View backgroundColor='#CCC' height={Constants.statusBarHeight} />
      <StatusBar
        barStyle='dark-content'
        backgroundColor='#FBBA25'
        translucent
      />
            <View alignItems="center">
                <Text color={'#1656AD'} marginTop={13} fontWeight={'bold'} fontSize={32}>Escolha um Plano!</Text>
            </View>

            <View alignItems="center" justifyContent="center" marginTop={200} gap={15}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{backgroundColor:'#ccc',width:350, height: 100, borderRadius:20}}>
                    <View alignItems="center" justifyContent="center">
                        <Text paddingTop={20} fontSize={50} fontWeight={'bold'}>Plano FREE</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIntegracaoMensal} style={{backgroundColor:'#ccc',width:350, height: 100, borderRadius:20}}>
                    <View alignItems="center" justifyContent="center">
                        <Text paddingTop={20} fontSize={50} fontWeight={'bold'}>Plano Mensal</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIntegracaoAnual} style={{backgroundColor:'#ccc',width:350, height: 100, borderRadius:20}}>
                    <View alignItems="center" justifyContent="center">
                        <Text paddingTop={20} fontSize={50} fontWeight={'bold'}>Plano Anual</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}