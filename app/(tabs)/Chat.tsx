import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native';
import BottomNav from '@/components/BottomNav';

const Chat = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" style={styles.chevron} />
        </TouchableOpacity>
        
        {/* Your chat content goes here */}
        <Text style={styles.placeholder}>Chat Content</Text>
      </SafeAreaView>
      
      {/* BottomNav will be positioned at the bottom because of its internal absolute positioning */}
      <BottomNav />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
    position: 'relative', // Important: provides positioning context for absolute elements
  },
  content: {
    flex: 1,
    paddingBottom: 90, // Add space at the bottom to prevent content from being covered by nav
  },
  backButton: {
    margin: 15,
  },
  chevron: {
    marginTop: 3
  },
  placeholder: {
    textAlign: 'center',
    marginTop: 20,
  }
});

export default Chat