import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "navigation";
import { StatusBar, Image, TouchableOpacity, Alert } from "react-native";
import { Button, View } from "tamagui";
import Constants from 'expo-constants';
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { decode } from "base64-arraybuffer";

interface FotoProps {
    route: {
        params: {
            photo:{
                base64: string
                uri: string
            }
        }
    }
    navigation: any
}

type PublicationSreenRouteProp = RouteProp<RootStackParamList, 'Publication'>;

export default function Publication({route, navigation} : FotoProps) {
    const {photo} = route.params
    const [userId, setUserId] = useState('');

    useEffect(() => {
        // Obter a sessão do usuário logado
        const getSession = async () => {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error || !session) {
            Alert.alert('Erro', 'Não foi possível obter a sessão do usuário.');
            return;
          }
          console.log(JSON.stringify(session))
          setUserId(session.user.id)
        };
        
        getSession();
      }, []);

    const uploadImage = async (uri: string, userId: string) => {
        try {
          console.log("Starting image upload...");
          console.log("Image URI:", uri);
      
          
      
          // Gere um caminho de arquivo único
          const filePath = `${userId}/${new Date().getTime()}.png`;
      
          // Defina o tipo de conteúdo
          const contentType = 'image/png';
      
          console.log("Uploading image...");
      
          // Faça o upload para o Supabase
          const { data, error } = await supabase.storage.from('profiles').upload(filePath, decode(photo.base64), {
            contentType,
          });
      
          if (error) {
            throw error;
          }
      
          return data.path;
        } catch (error) {
          console.log('Error uploading image:', error);
          Alert.alert('Erro', 'Não foi possível fazer o upload da imagem.');
          return null;
        }
      };

    async function Publicar() {
        const patch = await uploadImage(photo.uri, userId);

        if(patch) {
            const { data, error } = await supabase.from('posts').insert([
                {
                  user_id: userId,
                  image_url: patch
                },
              ]);

              if (error) {
                console.log('Error inserting profile:', error);
                Alert.alert('Erro', 'Não foi possível criar a publicação.');
              } else {
                Alert.alert('Sucesso', 'Imagem Publicada com Sucesso!');
                navigation.navigate('Feed')
              }
        }
    }

    return(
        <View flex={1}>
            <View backgroundColor='#007AA2' height={Constants.statusBarHeight} />
      <StatusBar
        barStyle='light-content'
        backgroundColor='#007AA2'
        translucent
      />
      <View marginTop={20}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{backgroundColor:'#fff', width:40, borderRadius:60, marginLeft:10}}>
                <Ionicons
                    name={'arrow-back'}
                    
                    size={40}
                    
                  />
                </TouchableOpacity>
      </View>
        <View alignItems="center" justifyContent="center" marginTop={80}>
        <Image source={{uri: photo.uri}}  style={{height: 500, width:430}}/>
        <Button onPress={Publicar} marginTop={50} width={400} color="#fff" size="$5" backgroundColor="$appPrimary50"  pressStyle={{ backgroundColor: "$appSecondary100" }} >
            Publicar
        </Button>
        </View>
        </View>
    )
}