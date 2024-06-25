import React, { useEffect, useRef, useState } from 'react'
import { RootStackParamList } from '../navigation';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { View, Text } from 'tamagui';
import Constants from 'expo-constants';
import { Button, Linking, PixelRatio, StatusBar, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { captureRef } from 'react-native-view-shot';
import { Ionicons } from '@expo/vector-icons';



type CameraSreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export default function Camera() {
    const [facing, setFacing] = useState(CameraType.back);
    const [uri, setUri] = useState(``)
  const cameraRef = useRef<CameraType | any>();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const targetPixelCount = 1080; 
const pixelRatio = PixelRatio.get(); 
const navigation: any = useNavigation();

const pixels = targetPixelCount / pixelRatio;

  function toggleCameraFacing() {
    setFacing(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }
  
  if (!permission) {
    return <View />
  }
  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View >
        <Text style={{ textAlign: 'center', alignItems:'center' }}>Precisamos da sua permissão para utilizar a sua câmera para continuar!</Text>
        <Button onPress={requestPermission} title="Permitir" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: any, data: any }) => {
    setScanned(true)
    console.log(data)
    setScanned(false)
  }

  async function takePicture() {
    if(cameraRef){
        const data = await cameraRef.current
        ?.takePictureAsync({
          skipProcessing: true,
          base64: true
        })
       navigation.navigate('Publication',{photo: {
        base64: data.base64,
        uri: data.uri
       }})

    }
  }
  return (
    <View flex={1} backgroundColor='#fff'>
      <View backgroundColor='#007AA2' height={Constants.statusBarHeight} alignItems='center' />
      <StatusBar
        barStyle='light-content'
        backgroundColor='#007AA2'
        translucent
      />
      <CameraView ref={cameraRef}  barcodeScannerSettings={{
        barcodeTypes: ["qr"] 
      }} style={{ height:725 }} facing={facing} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} >
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{backgroundColor:'#fff', width:40, borderRadius:60, marginLeft:10, position: 'absolute', marginTop: 15}}>
                <Ionicons
                    name={'arrow-back'}
                    size={40}
                  />
                </TouchableOpacity>
      </CameraView> 
      <View  flexDirection='row' marginTop={20}>
      
     <TouchableOpacity onPress={takePicture} style={{alignItems:'center', justifyContent:'center', marginRight:100, marginLeft: 170}}>
     <View backgroundColor={'#000'} alignItems='center' justifyContent='center' height={70} width={70} borderRadius={100}>
      <View backgroundColor={'#000'} borderColor={'#fff'} borderWidth={5} height={60} width={60} borderRadius={100}> 
      </View>
     </View>
     </TouchableOpacity>
     <TouchableOpacity  onPress={toggleCameraFacing} style={{alignItems:'center', justifyContent:'center'}}>
                  <Ionicons
                    name={'camera-reverse'}
                    size={50}
                  />
     </TouchableOpacity>
      </View>
 </View>
  )
}