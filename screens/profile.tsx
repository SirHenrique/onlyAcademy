import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { supabase } from "lib/supabase";
import { RootStackParamList } from "navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ImageBackground, SafeAreaView, TouchableOpacity, Image, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {Text, View } from 'tamagui'




type ProfileSreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
export default function Profile() {
  const [userId, setUserId] = useState('');
  const [image, setImage] = useState('');
  const navigation: any = useNavigation();
  const [photos, setPhotos] = useState<any[]>([]);
  const [foto, setFoto] = useState();
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0)
  
  useFocusEffect(useCallback(() => {
    // Este código será executado quando a tela for focada
    console.log('Tela Home focada');
    setCount(prevCount => prevCount + 1);
  }, []))


  useEffect(() => {
    // Obter a sessão do usuário logado
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        Alert.alert('Erro', 'Não foi possível obter a sessão do usuário.');
        return;
      }
      console.log(JSON.stringify(session.user.id))
      setUserId(session.user.id)
      console.log(userId)
    };
  
    const getProfile = async () => {
      const { data: sessionData } = await supabase.auth.getSession()

    if (sessionData?.session) {
      const { data: profileData, error: profileError, status } = await supabase
        .from('profile')
        .select('*')
        .eq('id', sessionData.session.user.id)
        
        console.log(profileData)
        if(profileData){

          
          supabase.storage
    .from('profiles')
    .download(profileData[0].profile_picture)
    .then(({ data }) => {
      const fr = new FileReader()
      fr.readAsDataURL(data!)
      fr.onload = () => {
        setImage(fr.result as string)
      }
    })
          
        }
        
      
    };
  }

  const getPosts = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (sessionData?.session) {
        const { data: profileData, error: profileError } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .order('created_at', { ascending: false });

        if (profileError) {
          throw new Error(profileError.message);
        }

        if (profileData) {
          const fotosPromises = profileData.map(async post => {
            const { data: imageData, error: imageError } = await supabase.storage
              .from('profiles')
              .download(post.image_url as string);

            if (imageError) {
              throw new Error(imageError.message);
            }

            if (imageData) {
              const fr = new FileReader();
              fr.readAsDataURL(imageData);
              return new Promise(resolve => {
                fr.onloadend = () => {
                  post.src = fr.result as string;
                  resolve(post);
                };
              });
            }
          });

          const fotos = await Promise.all(fotosPromises);
          setPhotos(fotos);
          setLoading(false);
        }
      }
    } catch (error : any) {
      console.error(error.message);
    }
  };

    getSession();
    getProfile();
    getPosts();
  }, [count]);

return(
    <View flex={1}>
        <ImageBackground style={{flex:1}} source={require('../assets/background.jpg')}>
        <SafeAreaView >
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{backgroundColor:'#fff', width:40, borderRadius:60, marginLeft:10}}>
                <Ionicons
                    name={'arrow-back'}
                    
                    size={40}
                    
                  />
                </TouchableOpacity>

                <View flex={1} alignItems="center" >
                    <View backgroundColor={'#fff'} height={160} width={160} alignItems="center" justifyContent="center" borderRadius={100}>
                    {image &&  <Image source={{uri: image}}  style={{height: 150, width:150, borderRadius:100}}/> } 
                    </View>  
                    
                </View>
                <View marginTop={250} alignItems="center" backgroundColor={'#fff'} alignSelf="stretch" height={600} borderRadius={30}>
               {photos && <FlatList
            data={photos}
            renderItem={({ item }) => (
              <View>
                <Image style={{height:125, width:125,margin:5}} source={{uri: item.src}}  />
              </View>
            )}
            keyExtractor={(item) => item.id}
            numColumns={3}
            style={{marginTop:10}}

            
          />} 
                </View>
            </View>
           

            


        </SafeAreaView>
        </ImageBackground>
    </View>
)

}