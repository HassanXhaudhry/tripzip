import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Users, Clock, Route, ArrowRight, Calendar } from 'lucide-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';

interface Passenger {
  type: string;
  count: number;
}

interface RideEstimationDetails {
  distance: number;
  duration: string;
  duration_seconds: number;
}

export default function RideInfo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedVehicle } = useSelector((state: RootState) => state.taxiType);
  const {
    pickupLocation,
    dropLocation,
    date,
    time,
    returnDate,
    returnTime,
    hasReturn,
    passengers,
    stops
  } = useSelector((state: RootState) => state.ride) as {
    pickupLocation: string;
    dropLocation: string;
    date: string;
    time: string;
    returnDate: string;
    returnTime: string;
    hasReturn: boolean;
    passengers: Passenger[];
    stops: string[];
  };
  

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [rideEstimation, setRideEstimation] = useState<RideEstimationDetails | null>(null);

  useEffect(() => {
    if (!pickupLocation || !dropLocation || !selectedVehicle) {
      if (!selectedVehicle) {
        router.replace('/TaxiType');
      }
      return;
    }

    const fetchRideEstimation = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setRideEstimation({
            distance: 15.7,
            duration: '25 mins',
            duration_seconds: 1500
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to fetch ride details. Please try again.');
        setLoading(false);
      }
    };

    fetchRideEstimation();
  }, [pickupLocation, dropLocation, selectedVehicle, stops]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string): string => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  const calculatePrice = (): string => {
    if (!selectedVehicle || !rideEstimation) return '0.00';
    return (selectedVehicle.price_per_km * rideEstimation.distance).toFixed(2);
  };

  const getTotalPassengers = (): number => {
    return passengers.reduce((sum, passenger) => sum + passenger.count, 0);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFA500" />
        <Text style={styles.loadingText}>Loading ride details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.replace('/TaxiType')}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Ride Details</Text>
      </View>

      {selectedVehicle && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vehicle</Text>
          <View style={styles.vehicleDetails}>
            <Text style={styles.vehicleName}>{selectedVehicle.title}</Text>
            {selectedVehicle.seating_capacity && (
              <Text style={styles.vehicleInfo}>Seats: {selectedVehicle.seating_capacity}</Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Route</Text>
        <View style={styles.routeItem}>
          <View style={styles.iconContainer}><MapPin size={20} color="#0066cc" /></View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeLabel}>Pickup</Text>
            <Text style={styles.routeText}>{pickupLocation}</Text>
          </View>
        </View>

        {stops.map((stop, index) => (
          <View key={index} style={styles.routeItem}>
            <View style={styles.iconContainer}><MapPin size={20} color="#FFA500" /></View>
            <View style={styles.routeTextContainer}>
              <Text style={styles.routeLabel}>Stop {index + 1}</Text>
              <Text style={styles.routeText}>{stop}</Text>
            </View>
          </View>
        ))}

        <View style={styles.routeItem}>
          <View style={styles.iconContainer}><MapPin size={20} color="#FF6347" /></View>
          <View style={styles.routeTextContainer}>
            <Text style={styles.routeLabel}>Drop-off</Text>
            <Text style={styles.routeText}>{dropLocation}</Text>
          </View>
        </View>

        {rideEstimation && (
          <View style={styles.routeSummary}>
            <View style={styles.routeSummaryItem}><Route size={16} color="#666" /><Text style={styles.routeSummaryText}>{rideEstimation.distance.toFixed(1)} km</Text></View>
            <View style={styles.routeSummaryItem}><Clock size={16} color="#666" /><Text style={styles.routeSummaryText}>{rideEstimation.duration}</Text></View>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Trip Details</Text>

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}><Calendar size={20} color="#666" /></View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailText}>{formatDate(date)}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}><Clock size={20} color="#666" /></View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailText}>{formatTime(time)}</Text>
          </View>
        </View>

        {hasReturn && (
          <>
            <View style={styles.detailItem}>
              <View style={styles.iconContainer}><Calendar size={20} color="#666" /></View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Return Date</Text>
                <Text style={styles.detailText}>{formatDate(returnDate)}</Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.iconContainer}><Clock size={20} color="#666" /></View>
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Return Time</Text>
                <Text style={styles.detailText}>{formatTime(returnTime)}</Text>
              </View>
            </View>
          </>
        )}

        <View style={styles.detailItem}>
          <View style={styles.iconContainer}><Users size={20} color="#666" /></View>
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Passengers</Text>
            <Text style={styles.detailText}>{getTotalPassengers()} passenger(s)</Text>
          </View>
        </View>

        <View style={styles.passengersBreakdown}>
          {passengers.map((passenger, index) =>
            passenger.count > 0 && (
              <Text key={index} style={styles.passengerBreakdownText}>
                {passenger.type}: {passenger.count}
              </Text>
            )
          )}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Price</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total</Text>
          <Text style={styles.price}>${calculatePrice()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
        <ArrowRight size={18} color="#FFF" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 12,
    width: '50%',
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  vehicleDetails: {
    marginTop: 8,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#555',
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    marginRight: 10,
    marginTop: 2,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 14,
    color: '#666',
  },
  routeText: {
    fontSize: 14,
    color: '#000',
    flexShrink: 1,
  },
  routeSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  routeSummaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeSummaryText: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailTextContainer: {
    marginLeft: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailText: {
    fontSize: 14,
    color: '#000',
  },
  passengersBreakdown: {
    marginTop: 12,
  },
  passengerBreakdownText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 10,
    paddingTop: 20,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
