import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { MapPin, ChevronDown, ChevronLeft } from 'lucide-react-native';
import { ScrollView } from 'react-native';

export default function NearbyScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" style={styles.chevron}/>
        </TouchableOpacity>
        <Text style={styles.title}>Select Taxi Type</Text>
      </View>
      <ScrollView>
      <View style={styles.mapContainer}>
        {/* Map placeholder - In production, use react-native-maps */}
        <View style={styles.map}>
          {/* Taxi markers */}
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={[styles.taxiMarker, { 
              left: `${Math.random() * 80}%`, 
              top: `${Math.random() * 80}%` 
            }]}>
              <MapPin size={24} color="#FFA500" />
            </View>
          ))}
        </View>
      </View>
      </ScrollView>
      <View style={styles.bottomSheet}>
        <Text style={styles.bottomSheetTitle}>Select Taxi Type</Text>
        <View style={styles.taxiTypeList}>
          {['Luxury', 'Super Luxury', 'Economy'].map((type) => (
            <TouchableOpacity key={type} style={styles.taxiTypeItem}>
              <Text style={styles.taxiTypeName}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Link href="/RideType" asChild>
          <TouchableOpacity style={styles.seePlanButton}>
            <Text style={styles.seePlanButtonText}>Choose Plan</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFB300',
  },
  backButton: {
    marginRight: 15,
  },
  chevron: {
    marginTop: 2
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  map: {
    flex: 1,
    position: 'relative',
  },
  taxiMarker: {
    position: 'absolute',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
  bottomSheet: {
    backgroundColor: '#FFB300',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  taxiTypeList: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  taxiTypeItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  taxiTypeName: {
    fontSize: 16,
    color: '#000',
  },
  seePlanButton: {
    backgroundColor: '#000000',
    borderRadius: 36,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    marginTop: 15,
  },
  seePlanButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});