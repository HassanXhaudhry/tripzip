import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, ChevronLeft } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVehicleTypes, selectVehicle } from '../../store/slices/taxiTypeSlice';
import { AppDispatch, RootState } from '@/store/store';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Taxi() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const scrollViewRef = useRef<ScrollView>(null);

  const { vehicles, selectedVehicleId, loading, error } = useSelector(
    (state: RootState) => state.taxiType
  );

  useEffect(() => {
    dispatch(fetchVehicleTypes());
  }, [dispatch]);

  const handleSelectVehicle = (id: string) => {
    dispatch(selectVehicle(id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#000"/>
          </TouchableOpacity>
          <Text style={styles.title}>Select Taxi Type</Text>
        </View>

    
        <View style={styles.mapContainer}>
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

        <View style={styles.bottomSheet}>
          <Text style={styles.bottomSheetTitle}>Select Taxi Type</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#FFA500" />
          ) : error ? (
            <Text style={styles.errorText}>Error: {error}</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {Array.isArray(vehicles) && vehicles.length > 0 ? (
                vehicles.map((vehicle) => (
                  <TouchableOpacity
                    key={vehicle.id}
                    style={[
                      styles.taxiTypeItem,
                      selectedVehicleId === vehicle.id && styles.selectedTaxiType
                    ]}
                    onPress={() => handleSelectVehicle(vehicle.id)}
                  >
                    <View style={styles.taxiInfo}>
                      <Text style={styles.taxiTypeName}>{vehicle.title}</Text>
                      <Text style={styles.taxiPrice}>
                        ${vehicle.price_per_km}/km
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyText}>No vehicles available</Text>
              )}
            </ScrollView>
          )}

          <View style={styles.buttonContainer}>
            {selectedVehicleId ? (
              <TouchableOpacity
                style={styles.seePlanButton}
                onPress={() => router.push('/RideType')}
              >
                <Text style={styles.seePlanButtonText}>Choose Plan</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.seePlanButton, styles.disabledButton]}
                disabled={true}
              >
                <Text style={styles.seePlanButtonText}>Choose Plan</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFB300',
  },
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mapContainer: {
    height: SCREEN_HEIGHT * 0.45, // 50% of screen height
    paddingHorizontal: 15,
    marginBottom:10
  },
  map: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    position: 'relative',
  },
  taxiMarker: {
    position: 'absolute',
    // Random positions set in the component
  },
  bottomSheet: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  taxiTypeItem: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selectedTaxiType: {
    borderColor: '#FFA500',
    backgroundColor: '#FFF8E7',
  },
  taxiInfo: {
    flex: 1,
  },
  taxiTypeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taxiPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFA500'
  },
  buttonContainer: {
    paddingVertical: 16,
  },
  seePlanButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  seePlanButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 15,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
});