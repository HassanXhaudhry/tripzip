import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { Check, ArrowRight } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface BookingSuccessModalProps {
  visible: boolean;
  onClose?: () => void;
  bookingId?: string | null; // Allow passing bookingId as prop
}

export default function BookingSuccessModal({ 
  visible, 
  onClose,
  bookingId: propBookingId // Rename to avoid conflict
}: BookingSuccessModalProps) {
  // Get bookingId from Redux state
  const { bookingId: reduxBookingId } = useSelector((state: RootState) => state.customerInfo);
  
  // Use prop bookingId if provided, otherwise fall back to Redux state
  const displayBookingId = propBookingId || reduxBookingId;
 
  console.log('BookingSuccessModal rendered with visible:', visible, 'displayBookingId:', displayBookingId);
  
  // Handle back button press when modal is visible
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible) {
        goToHome();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [visible]);

  const goToHome = () => {
    console.log('Navigating to home screen');
    if (onClose) {
      onClose();
    } else {
      router.replace('/(drawer)/Home');
    }
  };

  // If the modal is not visible, don't render anything
  if (!visible) {
    console.log('Modal not visible, returning null');
    return null;
  }

  console.log('Rendering modal content');
  
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={goToHome}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.card}>
          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Check size={50} color="#FFFFFF" strokeWidth={3} />
          </View>
          
          {/* Booking Success Text */}
          <Text style={styles.title}>
            Booking placed successfully
          </Text>
          
          {/* Booking ID Display */}
          {displayBookingId && (
            <Text style={styles.bookingId}>
              Booking ID: {displayBookingId}
            </Text>
          )}
          
          {/* Thank you message */}
          <Text style={styles.message}>
            Thank you for your booking! Your reservation has been successfully
            placed. Please proceed with your trip.
          </Text>
          
          {/* Go to Home Button */}
          <TouchableOpacity style={styles.button} onPress={goToHome}>
            <Text style={styles.buttonText}>Go to Home</Text>
            <ArrowRight size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    backgroundColor: '#FFB300',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 15,
  },
  bookingId: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFB300',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    flexDirection: 'row',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10
  },
});