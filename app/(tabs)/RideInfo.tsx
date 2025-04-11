import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Users, Clock, Route, ArrowRight } from 'lucide-react-native';

export default function RideInfoScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
    <View >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color="#000" style={styles.chevron}/>
        </TouchableOpacity>
        <Text style={styles.title}>Ride Info</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.journeyTitle}>Outward Journey</Text>

          <View style={styles.locationContainer}>
            <View style={styles.locationItem}>
              <MapPin size={20} color="#FFA500" />
              <Text style={styles.location}>647 Stratford Rd, Birmingham B11 4DY, UK</Text>
            </View>
            <View style={styles.locationItem}>
              <MapPin size={20} color="#FFA500" />
              <Text style={styles.location}>48GM+RC, Dover CT16 1JA, UK</Text>
            </View>
          </View>

          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Users size={20} color="#666" />
              <Text style={styles.detailLabel}>2 Passengers</Text>
            </View>

            <View style={styles.detailItem}>
              <Clock size={20} color="#666" />
              <Text style={styles.detailLabel}>2025-01-13T10:02:33.547Z</Text>
            </View>

            <View style={styles.detailItem}>
              <Clock size={20} color="#666" />
              <Text style={styles.detailLabel}>12:00 AM</Text>
            </View>

            <View style={styles.detailItem}>
              <Route size={20} color="#666" />
              <Text style={styles.detailLabel}>116.40 KM</Text>
            </View>

            <View style={styles.detailItem}>
              <Clock size={20} color="#666" />
              <Text style={styles.detailLabel}>1 hour, 13 minutes, 42 seconds</Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.price}>$1164.00</Text>
            </View>
          </View>

          <View style={styles.returnSection}>
            <Text style={styles.returnTitle}>Return Detail</Text>
            <View style={styles.returnDetails}>
              <View style={styles.detailItem}>
                <Clock size={20} color="#666" />
                <Text style={styles.detailLabel}>2025-01-13T10:02:33.547Z</Text>
              </View>
              <View style={styles.detailItem}>
                <Clock size={20} color="#666" />
                <Text style={styles.detailLabel}>12:30 AM</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight size={24} color="#FFF" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  chevron: {
    marginTop: 2
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  journeyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
  },
  locationContainer: {
    gap: 15,
    marginBottom: 20,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  location: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
  detailsList: {
    gap: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    marginTop: 10,
    paddingTop: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
  },
  returnSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 20,
  },
  returnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  returnDetails: {
    gap: 15,
  },
  nextButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});