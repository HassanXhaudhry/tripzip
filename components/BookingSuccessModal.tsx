// BookingSuccessModal.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { router } from 'expo-router';
import { Check, ArrowRight } from 'lucide-react-native';

interface BookingSuccessModalProps {
  visible: boolean;
  onClose?: () => void;
}

export default function BookingSuccessModal({ visible, onClose }: BookingSuccessModalProps) {
  // Navigate to home screen
  const goToHome = () => {
    // Close modal if onClose is provided
    if (onClose) {
      onClose();
    }
    
    // Navigate to home
    router.replace('/');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
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
    backgroundColor: 'rgba(255, 165, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    backgroundColor: '#FFA500',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666666',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});