import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from 'navigation';
import React from 'react';
import { View, Image } from 'react-native';

type FeedSreenRouteProp = RouteProp<RootStackParamList, 'ImageScreen'>;

function ImageScreen({ route }: any) {
  const { imageUri } = route.params;

  return (
    <View>
      <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} />
    </View>
  );
}

export default ImageScreen;