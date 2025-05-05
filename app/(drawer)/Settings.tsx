import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Settings = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <Text style={styles.placeholder}>Settings Content</Text>
      </SafeAreaView>
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

export default Settings