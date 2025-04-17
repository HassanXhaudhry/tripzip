import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native';
import BottomNav from '@/components/BottomNav';

const Chat = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ChevronLeft size={24} color="#000" style={styles.chevron} />
      </TouchableOpacity>
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
  },
  backButton: {
    margin: 15,
  },
  chevron: {
    marginTop: 3
  },
});
export default Chat