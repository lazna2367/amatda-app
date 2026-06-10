import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BagDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <View style={{ flex: 1, backgroundColor: '#f7f6f1' }}>
      <Text>가방 상세 {id}</Text>
    </View>
  );
}
