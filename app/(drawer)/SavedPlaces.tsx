import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const SavedPlaces = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
    position: 'relative',
  },
  content: {
    flex: 1,
    paddingBottom: 30,
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
  },
  addButton: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: '#000',
    marginHorizontal: 20,
    marginVertical: 40,
    height: 50,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
},
addButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
}
});

export default SavedPlaces