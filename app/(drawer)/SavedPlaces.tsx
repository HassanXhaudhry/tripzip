import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const SavedPlaces = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Saved Places</Text>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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