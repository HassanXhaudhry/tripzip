import { View, Text, StyleSheet, TouchableOpacity, BackHandler, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { logout } from '../../store/slices/authSlice';
import { useEffect, Fragment } from 'react';
import { AppDispatch } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Home() {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const fullname = useSelector((state: RootState) => state.auth.user?.cus_fullname);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            try {
                const navState = navigation.getState?.();
                const currentIndex = navState?.index;
                const currentRoute = navState?.routes?.[currentIndex ?? 0];
    
                if (currentRoute?.name === 'Home') {
                    BackHandler.exitApp();
                    return true;
                }
            } catch (error) {
                console.log('Error checking navigation state:', error);
            }
            return false; // Allow default back behavior
        });
    
        return () => backHandler.remove();
    }, [navigation]);
    

    const handleLogout = async () => {
        await dispatch(logout());
        // Using router directly from expo-router
        router.replace('/(auth)/Login');
    };

    const navigateToRide = () => {
        // Using router directly from expo-router
        router.push('/(tabs)/Ride');
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
                            onPress={navigateToRide}>
                            <Text style={styles.bookButtonText}>Book Your Ride</Text>
                            <ArrowRight size={18} color="#FFF" />
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
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