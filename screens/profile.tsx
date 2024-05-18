import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "navigation";
import React from "react";
import { ImageBackground, SafeAreaView, TouchableOpacity, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {Text, View } from 'tamagui'


const galleryImages = [
    { id: '1', src: require('../photos/Riki.jpg') },
    { id: '2', src: require('../photos/gato.jpg') },
    { id: '3', src: require('../photos/gato2.jpg') },
    { id: '4', src: require('../photos/gato3.jpg') },
    { id: '5', src: require('../photos/gato4.jpg') }
  ];

type ProfileSreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
export default function Profile() {


return(
    <View flex={1}>
        <ImageBackground style={{flex:1}} source={require('../assets/background.jpg')}>
        <SafeAreaView >
            <View>
                <TouchableOpacity style={{backgroundColor:'#fff', width:40, borderRadius:60, marginLeft:10}}>
                <Ionicons
                    name={'arrow-back'}
                    
                    size={40}
                    
                  />
                </TouchableOpacity>

                <View flex={1} alignItems="center">
                    <View backgroundColor={'#fff'} height={160} width={160} alignItems="center" justifyContent="center" borderRadius={100}>
                    <Image source={require('../assets/Riki.jpg')}  style={{height: 150, width:150, borderRadius:100}}/>
                    </View>  
                    
                </View>
                <View alignItems="center" justifyContent="center" marginTop={200}  gap={40} flexDirection="row">
                        <TouchableOpacity  style={{backgroundColor:'#fff',width:80,height:30, alignItems:'center',justifyContent:'center',borderRadius:30}}>
                            <Text fontSize={20}>Seguir</Text>
                        </TouchableOpacity>
                        <TouchableOpacity  style={{backgroundColor:'#fff',width:80,height:30, alignItems:'center',justifyContent:'center',borderRadius:30}}>
                            <Text fontSize={20}>Foto</Text>
                        </TouchableOpacity>
                </View>
                <View marginTop={30} alignItems="center" backgroundColor={'#fff'} alignSelf="stretch" height={600} borderRadius={30}>
                <FlatList
            data={galleryImages}
            renderItem={({ item }) => (
              <View>
                <Image style={{height:125, width:125,margin:5}} source={item.src}  />
              </View>
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={{marginTop:10}}

            
          />
                </View>
            </View>
           

            


        </SafeAreaView>
        </ImageBackground>
    </View>
)

}