import { View, Text, StyleSheet, TouchableOpacity, BackHandler, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, Fragment } from 'react';
import { AppDispatch } from '../../store/store';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store/store';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRight } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Home() {
    const navigation = useNavigation();

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
            return false; 
        });

        return () => backHandler.remove();
    }, [navigation]);

    const navigateToRide = () => {
        router.push('/(tabs)/Ride');
    };

    return (
        <Fragment>
            <View style={styles.container}>
                <SafeAreaView style={styles.safeArea}>
                    <ScrollView contentContainerStyle={styles.scrollContent}>
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
    scrollContent: {
        flexGrow: 1
    },
    bookButton: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: '#000',
        marginHorizontal: 20,
        marginVertical: 40,
        height: 50,
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