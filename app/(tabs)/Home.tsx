import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice'
import { useState, useEffect, Fragment } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { AppDispatch } from '../../store/store';
import { useNavigation, useRouter } from 'expo-router';
import BottomNav from '@/components/BottomNav';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react-native';


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
        <Fragment>
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                    <Text style={styles.welcomeText}>
                        TripZip
                    </Text>
                        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                            <MaterialIcons name="logout" size={24} color="black" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => router.push('/(tabs)/Ride')}>
                        <Text style={styles.bookButtonText}>Book Your Ride</Text>
                        <ArrowRight size={18} color="#FFF" />
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            <BottomNav />
        </View>
        </Fragment>
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
        paddingBottom: 90,
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
        fontStyle: 'italic',
        fontWeight: 'bold',
    },    
    logoutButton: {
        padding: 8,
    },
    locationText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginLeft: 20,
        marginBottom: 10,
    },
    mapContainer: {
        height: 300, 
        marginHorizontal: 20,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    bookButton: {
        flexDirection: "row",
        gap: 10,
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