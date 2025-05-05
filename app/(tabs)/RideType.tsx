import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ChevronLeft, Car, Users, Gauge, Calendar, Box, ArrowRight } from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { selectVehicle } from '@/store/slices/taxiTypeSlice';

export default function RideTypeScreen() {
  const router = useRouter();
  const { selectedVehicle } = useSelector((state: RootState) => state.taxiType);
  const dispatch = useDispatch<AppDispatch>();



  const estimatedDistance = 40;
  const totalPrice = selectedVehicle ? selectedVehicle.price_per_km * estimatedDistance : 0;

  if (!selectedVehicle) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#000" style={styles.chevron} />
          </TouchableOpacity>
          <Text style={styles.title}>Taxi Type</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.carCard}>
            <Text style={styles.carType}>{selectedVehicle.title}</Text>
            <Text style={styles.price}>${selectedVehicle.price_per_km}/km</Text>
            <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
            <View style={styles.separator} />
            <View style={styles.specList}>
              <View style={styles.specItem}>
                <Car size={20} color="#666" />
                <Text style={styles.specLabel}>Taxi Doors</Text>
                <Text style={styles.specValue}>{selectedVehicle.doors || "N/A"}</Text>
              </View>
              <View style={styles.specItem}>
                <Users size={20} color="#666" />
                <Text style={styles.specLabel}>Passengers</Text>
                <Text style={styles.specValue}>{selectedVehicle.seating_capacity || "N/A"}</Text>
              </View>
              <View style={styles.specItem}>
                <Gauge size={20} color="#666" />
                <Text style={styles.specLabel}>Horse Power</Text>
                <Text style={styles.specValue}>{selectedVehicle.horse_power ? `${selectedVehicle.horse_power} cc` : "N/A"}</Text>
              </View>
              <View style={styles.specItem}>
                <Calendar size={20} color="#666" />
                <Text style={styles.specLabel}>Model</Text>
                <Text style={styles.specValue}>{selectedVehicle.model || "N/A"}</Text>
              </View>
              <View style={styles.specItem}>
                <Box size={20} color="#666" />
                <Text style={styles.specLabel}>Shape</Text>
                <Text style={styles.specValue}>{selectedVehicle.shape || "N/A"}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.chooseButton}
            onPress={() => {
              if (selectedVehicle) {
                dispatch(selectVehicle(selectedVehicle.id));
                // Use this for safer navigation:
                setTimeout(() => {
                  router.push('/RideInfo');
                }, 0);
              }
            }}
          >
            <Text style={styles.chooseButtonText}>Choose</Text>
            <ArrowRight size={18} color="#FFF" />
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: 20
  },
  backButton: {
    marginRight: 15,
  },
  chevron: {
    marginTop: 2
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  carCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  carType: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    color: '#FFA500',
    marginBottom: 5,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: 20,
  },
  specList: {
    gap: 15,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  specLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  specValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  chooseButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
  },
  chooseButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});