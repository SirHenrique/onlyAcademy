import React, { useEffect, useRef, useState } from 'react'
import { RootStackParamList } from '../navigation';
import { RouteProp, useRoute } from '@react-navigation/native';
import { View, Text } from 'tamagui';
import Constants from 'expo-constants';
import { Button, Linking, PixelRatio, StatusBar, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { CameraType } from 'expo-camera/build/legacy/Camera.types';
import { captureRef } from 'react-native-view-shot';



type CameraSreenRouteProp = RouteProp<RootStackParamList, 'Camera'>;

export default function Camera() {
    const [facing, setFacing] = useState(CameraType.back);
    const [uri, setUri] = useState(``)
  const cameraRef = useRef<CameraType | any>();
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const targetPixelCount = 1080; 
const pixelRatio = PixelRatio.get(); 

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
        })
       setUri(data.uri)

    }
  }
  return (
    <View flex={1} backgroundColor='#fff'>
      <View backgroundColor='#FFF' height={Constants.statusBarHeight} />
      <StatusBar
        barStyle='dark-content'
        backgroundColor='#FBBA25'
        translucent
      />
      <CameraView ref={cameraRef}  barcodeScannerSettings={{
        barcodeTypes: ["qr"] 
      }} style={{ height:725 }} facing={facing} onBarcodeScanned={scanned ? undefined : handleBarCodeScanned} >
      </CameraView> 
      <View flexDirection='row'>
      <TouchableOpacity  onPress={toggleCameraFacing} style={{alignItems:'center', justifyContent:'center', marginTop:40}}>
            <Text fontSize={30}>Trocar Câmera!</Text>
     </TouchableOpacity>
     <TouchableOpacity  onPress={takePicture} style={{alignItems:'center', justifyContent:'center', marginTop:40}}>
            <Text fontSize={30}>Tirar Foto!</Text>
     </TouchableOpacity>
      </View>
      
 </View>
  )
}