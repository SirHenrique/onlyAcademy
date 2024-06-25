import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "navigation";
import { ScrollView, View, Text } from "tamagui";
import Constants from 'expo-constants';
import { SafeAreaView, StatusBar, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "lib/supabase";
import { FlatList } from "react-native-gesture-handler";

type FeedSreenRouteProp = RouteProp<RootStackParamList, 'Feed'>;

export default function Feed()
{
    const navigation: any = useNavigation();
    const [userId, setUserId] = useState('');
  const [image, setImage] = useState('');
  const [photos, setPhotos] = useState<any[]>([]);
  const [foto, setFoto] = useState('');
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0)

    useFocusEffect(useCallback(() => {
      // Este código será executado quando a tela for focada
      console.log('Tela Home focada');
      setCount(prevCount => prevCount + 1);
    }, []))

    useEffect(() => {
      const getPostsAndProfiles = async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession();
  
          if (sessionData?.session) {
            const { data: postData, error: postError } = await supabase
              .from('posts')
              .select('*, profile (first_name, last_name, profile_picture)')
              .order('created_at', { ascending: false });
  
            if (postError) {
              throw new Error(postError.message);
            }
  
            if (postData) {
              const photosPromises = postData.map(async post => {
                // Baixa a imagem do post
                if (post.image_url) {
                  const { data: imageData, error: imageError } = await supabase.storage
                    .from('profiles')
                    .download(post.image_url as string);
  
                  if (imageError) {
                    throw new Error(imageError.message);
                  }
                  console.log("Carregando")
                  if (imageData) {
                    const fr = new FileReader();
                    fr.readAsDataURL(imageData);
                    post.src = await new Promise(resolve => {
                      fr.onloadend = () => {
                        resolve(fr.result as string);
                      };
                    });
                  }
                }
  
                // Baixa a imagem do perfil
                if (post.profile.profile_picture) {
                  const { data: profileData, error: profileError } = await supabase.storage
                    .from('profiles')
                    .download(post.profile.profile_picture as string);
  
                  if (profileError) {
                    throw new Error(profileError.message);
                  }
  
                  if (profileData) {
                    const fr = new FileReader();
                    fr.readAsDataURL(profileData);
                    post.profile.profile_picture = await new Promise(resolve => {
                      fr.onloadend = () => {
                        resolve(fr.result as string);
                      };
                    });
                  }
                }
  
                return post;
              });
  
              const photos = await Promise.all(photosPromises);
              setPhotos(photos);
            }
          }
        } catch (error: any) {
          console.error(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      getPostsAndProfiles();
    }, [count]);

return (
    <View flex={1}>
        <View backgroundColor='#007AA2' height={Constants.statusBarHeight} />
        <StatusBar
          barStyle='light-content'
          backgroundColor='#007AA2'
          translucent
        />
        <SafeAreaView >
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('Camera')} style={{backgroundColor:'#fff', width:60, borderRadius:60, marginLeft:10, marginTop: 15, alignItems:'center', height:60, justifyContent: 'center'}}>
                <Ionicons
                    name={'camera'}
                    size={45}
                  />
                </TouchableOpacity>
        { !loading &&  <FlatList
            data={photos}
            renderItem={({ item }) => (
                <View margin={10} padding={10} backgroundColor={'#fff'} borderRadius={8}>
                <View flexDirection="row" alignItems="center" >
                 <Image source={{ uri: item.profile.profile_picture }} style={{
    width: 75,
    height: 75,
    borderRadius: 20,
    marginRight: 10,
  }} /> 
                  <Text fontSize={16} fontWeight={'bold'} >{item.profile.first_name} {item.profile.last_name}</Text>
                </View>
                { item.src && <Image source={{ uri: item.src }} style={{
    width: '100%',
    height: 400,
    marginTop: 10,
  }} /> }
              </View>
            )}
            keyExtractor={(item) => item.id}
            style={{marginTop:10, marginBottom: 10}}

            
          /> }
        </View>
        </SafeAreaView>
    </View>
    
)
    
}