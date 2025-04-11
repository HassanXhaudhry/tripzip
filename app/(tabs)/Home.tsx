import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
//import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice'
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import Feather from '@expo/vector-icons/Feather';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { useNavigation, useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                // Get current navigation state
                const state = navigation.getState();
                const currentRoute = state?.routes[state.index]?.name;
                // Exit app only if on Home screen
                if (currentRoute === 'Home') {
                    BackHandler.exitApp();
                    return true; // Prevent default back behavior
                }
                return false; // Allow default back behavior
            }
        );
        return () => backHandler.remove();
    }, [navigation]);

    const handleLogout = async () => {
        await dispatch(logout());
        router.replace('../Login');
    };

    // const [location, setLocation] = useState<Location.LocationObject | null>(null);
    // const [cars] = useState(
    //       [
    //       { id: 1, latitude: 37.78925, longitude: -122.4324 },
    //       { id: 2, latitude: 37.78825, longitude: -122.4314 },
    //       { id: 3, latitude: 37.78725, longitude: -122.4334 },
    //       { id: 4, latitude: 37.78625, longitude: -122.4344 },
    //       { id: 5, latitude: 37.78525, longitude: -122.4354 },
    //       { id: 6, latitude: 37.78425, longitude: -122.4364 },
    //       { id: 7, latitude: 37.78325, longitude: -122.4374 },
    //     ]
    // );

    // useEffect(() => {
    //     (async () => {
    //         const { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             return;
    //         }

    //         const currentLocation = await Location.getCurrentPositionAsync({});
    //         setLocation(currentLocation);
    //     })();
    // }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Welcome John</Text>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <MaterialIcons name="logout" size={24} color="black" />
                    </TouchableOpacity>
                </View>
                <View style={styles.searchContainer}>
                    <Feather name="search" size={18} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Where do you want to go?"
                        placeholderTextColor="#666"
                    />
                </View>

                <Text style={styles.locationText}>Your current location</Text>

                {/* <View style={styles.mapContainer}>
                    <MapView
                        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                        style={styles.map}
                        initialRegion={{
                            latitude: location?.coords.latitude || 37.78825,
                            longitude: location?.coords.longitude || -122.4324,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
                    >
                        {location && (
                            <Marker
                                coordinate={{
                                    latitude: location.coords.latitude,
                                    longitude: location.coords.longitude,
                                }}
                                pinColor="#4A90E2"
                            />
                        )}
                        {cars.map((car) => (
              <Marker
                key={car.id}
                coordinate={{
                  latitude: car.latitude,
                  longitude: car.longitude,
                }}
                pinColor="#000"
              />
            ))}
                    </MapView>
                </View> */}

                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => router.push('/(tabs)/Ride')}>
                    <Text style={styles.bookButtonText}>Book Your Ride →</Text>
                </TouchableOpacity>

                <BottomNav />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        backgroundColor: '#FFB300',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    logoutButton: {
        padding: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        margin: 20,
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingLeft: 10
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginLeft: 20,
        marginBottom: 10,
    },
    mapContainer: {
        height: 300, // Fixed height for the map
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    bookButton: {
        backgroundColor: '#000',
        marginHorizontal: 20,
        marginBottom: 40,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '600',
    }
});