import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice'
import { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { AppDispatch } from '../../store/store';
import { useNavigation, useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';


export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const navigation = useNavigation();

    const fullname = useSelector((state: RootState) => state.auth.user?.cus_fullname);

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

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        Welcome,{'\n'}{fullname || 'Guest'}!
                    </Text>
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
                            returnKeyType="search"
                            onSubmitEditing={() => {/* trigger search */ }}
                        />
                    </View>

                    <Text style={styles.locationText}>Your current location</Text>

                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => router.push('/(tabs)/Ride')}>
                        <Text style={styles.bookButtonText}>Book Your Ride →</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            
            {/* BottomNav is outside the ScrollView */}
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#FFB300',
    },
    safeArea: {
        flex: 1,
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
        paddingBottom: 90, // Add space for the bottom navigation
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    welcomeText: {
        fontSize: 20,
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