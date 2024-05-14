import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import { RootStackParamList } from '../navigation';

type DetailsSreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

export default function Details() {
  const router = useRoute<DetailsSreenRouteProp>();

  return (
    <View style={styles.container}>
      
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
