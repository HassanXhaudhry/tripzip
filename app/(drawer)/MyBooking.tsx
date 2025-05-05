import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    FlatList,
    ActivityIndicator,
  } from 'react-native';
  import React, { useEffect, useState } from 'react';
  import { useRouter } from 'expo-router';
  import { ChevronLeft } from 'lucide-react-native';
  import { useAppDispatch, useAppSelector } from '../../store/hooks';
  import { fetchCustomerBookings, Booking } from '../../store/slices/myBookingSlice';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import Toast from 'react-native-toast-message';
  
  const MyBooking = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [localCusUid, setLocalCusUid] = useState<string | null>(null);
  
    const user = useAppSelector((state) => state.auth.user);
    const { bookings, totalBookings, loading, error } = useAppSelector((state) => state.booking);
  
    useEffect(() => {
      const getCusUid = async () => {
        try {
          const storedCusUid = await AsyncStorage.getItem('cus_uid');
          if (storedCusUid) {
            setLocalCusUid(storedCusUid);
          } else if (user?.cus_uid) {
            setLocalCusUid(user.cus_uid.toString());
          } else {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'Customer ID not found. Please login again.',
            });
          }
        } catch (error) {
          console.error('Error retrieving customer ID:', error);
        }
      };
      getCusUid();
    }, [user]);
  
    useEffect(() => {
      if (localCusUid) {
        dispatch(fetchCustomerBookings(localCusUid)).catch((err) => {
          console.error('Fetch bookings failed:', err);
        });
      }
    }, [dispatch, localCusUid]);
  
    const renderBookingItem = ({ item }: { item: Booking }) => {
      const totalFare = item.price_per_km * item.distance_in_km;
  
      const formattedDate = new Date(item.booking_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
  
      return (
        <View style={styles.bookingItem}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingId}>Ref: {item.reference_id}</Text>
            <Text
              style={[
                styles.statusBadge,
                item.status === 'Completed'
                  ? styles.statusCompleted
                  : item.status === 'Cancelled'
                  ? styles.statusCancelled
                  : styles.statusPending,
              ]}
            >
              {item.status || 'Pending'}
            </Text>
          </View>
  
          <Text style={styles.bookingTitle}>{item.title || 'Booking'}</Text>
  
          <View style={styles.locationContainer}>
            <View style={styles.locationRow}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText}>{item.pickup || 'Pickup location'}</Text>
            </View>
            <View style={styles.locationDivider} />
            <View style={styles.locationRow}>
              <View style={[styles.locationDot, styles.destinationDot]} />
              <Text style={styles.locationText}>{item.drop_off || 'Drop Off location'}</Text>
            </View>
          </View>
  
          <View style={styles.bookingFooter}>
            <Text style={styles.bookingDate}>{formattedDate}</Text>
            <Text style={styles.bookingFare}>${totalFare.toFixed(2)}</Text>
          </View>
        </View>
      );
    };
  
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Bookings</Text>
          </View>
  
          <View style={styles.totalBookingsContainer}>
            <Text style={styles.totalBookingsText}>
              Total Bookings: <Text style={styles.totalBookingsCount}>{totalBookings}</Text>
            </Text>
          </View>
  
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFB300" />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => localCusUid && dispatch(fetchCustomerBookings(localCusUid))}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : bookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No bookings found</Text>
            </View>
          ) : (
            <FlatList
              data={bookings}
              renderItem={renderBookingItem}
              keyExtractor={(item) =>
                item.id?.toString() || item.reference_id?.toString() || Math.random().toString()
              }
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </View>
    );
  };
  

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
  backButton: {
    padding: 5,
  },
  chevron: {
    marginTop: 3,
  },
  placeholder: {
    width: 30,
  },
  totalBookingsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  totalBookingsText: {
    fontSize: 16,
  },
  totalBookingsCount: {
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  bookingItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookingId: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  statusCompleted: {
    backgroundColor: '#E6F7ED',
    color: '#00A353',
  },
  statusCancelled: {
    backgroundColor: '#FFEEEE',
    color: '#E53935',
  },
  statusPending: {
    backgroundColor: '#FFF8E6',
    color: '#FFB300',
  },
  locationContainer: {
    marginVertical: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 10,
  },
  destinationDot: {
    backgroundColor: '#F44336',
  },
  locationDivider: {
    height: 20,
    width: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 5,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  bookingDate: {
    color: '#757575',
    fontSize: 14,
  },
  bookingFare: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    color: '#E53935',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#FFB300',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#757575',
    fontSize: 16,
  },
});

export default MyBooking;