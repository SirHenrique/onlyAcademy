import React, { useCallback, useEffect, useState } from 'react';
import {Button,  Image,  StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, StatusBar} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { RootStackParamList } from 'navigation';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {  Input, Label, View, Text, TextArea  } from 'tamagui';
import Constants from 'expo-constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { supabase } from 'lib/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

type CreateProfileSreenRouteProp = RouteProp<RootStackParamList, 'CreateProfile'>;

const ProfileImagePicker: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [bio, setBio] = useState('')
  const navigation: any = useNavigation();
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


  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date : any) => {
    console.warn("A date has been picked: ", date);
    setDate(date);
    hideDatePicker();
  };

  const uploadImage = async (uri: string, userId: string) => {
    try {
      console.log("Starting image upload...");
      console.log("Image URI:", uri);
  
      // Leia a imagem como base64
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  
      // Gere um caminho de arquivo único
      const filePath = `${userId}/${new Date().getTime()}.png`;
  
      // Defina o tipo de conteúdo
      const contentType = 'image/png';
  
      console.log("Uploading image...");
  
      // Faça o upload para o Supabase
      const { data, error } = await supabase.storage.from('profiles').upload(filePath, decode(base64), {
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

  const handleSubmit = async () => {
    if (!firstName || !lastName || !bio || !image || !date) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos e selecione uma imagem.');
      return;
    }
    console.log(userId)
    const imageUrl = await uploadImage(image, userId);
    if (imageUrl) {
      console.log(imageUrl)
      console.log(date.toISOString())
      const { data, error } = await supabase.from('profile').insert([
        {
          first_name: firstName,
          last_name: lastName,
          bio: bio,
          birthdate: date.toISOString(),
          profile_picture: imageUrl
        },
      ]);

      if (error) {
        console.log('Error inserting profile:', error);
        Alert.alert('Erro', 'Não foi possível criar o perfil.');
      } else {
        Alert.alert('Sucesso', 'Perfil criado com sucesso!');
        navigation.navigate('Home')
      }
    }
  };
  const pickImage = async () => {
    // Solicitar permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Desculpe, precisamos da permissão para acessar a galeria!');
      return;
    }

   
    // Abrir a galeria de fotos
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
  <View>
    <View backgroundColor='#007AA2' height={Constants.statusBarHeight} />
      <StatusBar
        barStyle='light-content'
        backgroundColor='#007AA2'
        translucent
      />
    <KeyboardAwareScrollView>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <View flex={1} >
      
      <View flex={1} alignItems='center'>
      <Button title="Selecionar Foto de Perfil" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <View gap={15}>
        <View>
                <Label fontWeight={'bold'}>Nome</Label>
                <Input borderColor="$appPrimary50" onChangeText={setFirstName} width={300}  focusStyle={{ borderColor: "$appPrimary50" }} size="$5" id="first" />
        </View>
        <View>
                <Label fontWeight={'bold'}>Sobrenome</Label>
                <Input borderColor="$appPrimary50" onChangeText={setLastName} width={300}  focusStyle={{ borderColor: "$appPrimary50" }} size="$5" id="last" />
        </View>
        <View alignItems='center'>
                <Label fontWeight={'bold'}>Data de Nascimento</Label>
                {date && <Text fontSize={25} justifyContent='center'>{format(date, 'dd/MM/yyyy')}</Text>}
                <Button title="Clique aqui para selecionar" onPress={showDatePicker} />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  locale='pt-BR'
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
        </View>
        <View>
          <Label fontWeight={'bold'}>Biografia</Label>
          <TextArea borderColor="$appPrimary50" focusStyle={{ borderColor: "$appPrimary50" }} onChangeText={setBio} size="$5" ></TextArea>
        </View>
        <View alignItems='center'>
            <TouchableOpacity onPress={handleSubmit} style={{backgroundColor: "#007AA2", width:300,height:50, alignItems: 'center', justifyContent: 'center', borderRadius:10}}>
              <Text color={'#fff'} fontSize={25} fontWeight={'bold'}>Cadastrar</Text>
            </TouchableOpacity>
        </View>
      </View>
      
      
      </View>
</View>
</TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 20,
  },
});

export default ProfileImagePicker;

