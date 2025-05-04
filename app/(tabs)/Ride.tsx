import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Modal } from 'react-native';
import { MapPin, ArrowRight, Users, Calendar, Clock, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
    setPickupLocation,
    setDropLocation,
    setDate,
    setTime,
    setReturnDate,
    setReturnTime,
    setHasReturn,
    setPassengers,
    setStops
} from '@/store/slices/rideSlice';

type DateTimePickerEventType = {
    type: string;
    nativeEvent: {
        timestamp?: number;
    };
};

// Use the same Passenger interface from the Redux store
interface Passenger {
    count: number;
    type?: string;
    ageRange?: string;
}

export default function Ride() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    // Access ride state from redux
    const {
        pickupLocation,
        dropLocation,
        date: rideDate,
        time: rideTime,
        returnDate: rideReturnDate,
        returnTime: rideReturnTime,
        hasReturn,
        passengers,
        stops
    } = useSelector((state: RootState) => state.ride);

    // Initialize local state
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState<boolean>(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showPassengerModal, setShowPassengerModal] = useState(false);

    // Parse dates from ISO strings
    const currentDate = new Date(rideDate);
    const currentTime = new Date(rideTime);
    const returnDateObj = new Date(rideReturnDate);
    const returnTimeObj = new Date(rideReturnTime);

    // Initialize passengers if empty
    const [localPassengers, setLocalPassengers] = useState<Passenger[]>(
        passengers.length > 0 ? passengers : [
            { count: 0, type: 'Adult', ageRange: '12+ years' },
            { count: 0, type: 'Child', ageRange: '2-11 years' },
            { count: 0, type: 'Infant', ageRange: 'Under 2 years' }
        ]
    );

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (time: Date): string => {
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const onDateChange = (_: DateTimePickerEventType, selectedDate?: Date): void => {
        setShowDatePicker(false);
        if (selectedDate) {
            dispatch(setDate(selectedDate.toISOString()));
        }
    };

    const onTimeChange = (_: DateTimePickerEventType, selectedTime?: Date): void => {
        setShowTimePicker(false);
        if (selectedTime) {
            dispatch(setTime(selectedTime.toISOString()));
        }
    };

    const onReturnDateChange = (_: DateTimePickerEventType, selectedDate?: Date): void => {
        setShowReturnDatePicker(false);
        if (selectedDate) {
            dispatch(setReturnDate(selectedDate.toISOString()));
        }
    };

    const onReturnTimeChange = (_: DateTimePickerEventType, selectedTime?: Date): void => {
        setShowReturnTimePicker(false);
        if (selectedTime) {
            dispatch(setReturnTime(selectedTime.toISOString()));
        }
    };

    const addStop = (): void => {
        if (stops.length < 3) {
            dispatch(setStops([...stops, '']));
        } else {
            Alert.alert('Maximum Stops', 'You can add a maximum of 3 stops.');
        }
    };

    const updateStop = (index: number, value: string): void => {
        const newStops: Array<string> = [...stops];
        newStops[index] = value;
        dispatch(setStops(newStops));
    };

    const removeStop = (index: number): void => {
        const newStops: Array<string> = [...stops];
        newStops.splice(index, 1);
        dispatch(setStops(newStops));
    };

    const validateForm = (): boolean => {
        if (!pickupLocation) {
            Alert.alert('Error', 'Please enter a pickup location');
            return false;
        }
        if (!dropLocation) {
            Alert.alert('Error', 'Please enter a drop-off location');
            return false;
        }

        const totalPassengers = getTotalPassengers();
        if (totalPassengers === 0) {
            Alert.alert('Error', 'Please select at least one passenger');
            return false;
        }

        if (hasReturn) {
            const pickupDateTime = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                currentTime.getHours(),
                currentTime.getMinutes()
            );

            const returnDateTime = new Date(
                returnDateObj.getFullYear(),
                returnDateObj.getMonth(),
                returnDateObj.getDate(),
                returnTimeObj.getHours(),
                returnTimeObj.getMinutes()
            );

            if (returnDateTime <= pickupDateTime) {
                Alert.alert('Error', 'Return time must be after pickup time');
                return false;
            }
        }
        return true;
    };

    const handlePassengerChange = (index: number, increment: boolean) => {
        const updatedPassengers = localPassengers.map((passenger, i) => {
            if (i === index) {
                const newCount = increment ? passenger.count + 1 : Math.max(0, passenger.count - 1);
                return { ...passenger, count: newCount };
            }
            return passenger;
        });

        setLocalPassengers(updatedPassengers);
        dispatch(setPassengers(updatedPassengers));
    };

    const getTotalPassengers = () => {
        return localPassengers.reduce((sum, passenger) => sum + passenger.count, 0);
    };

    const bookRide = (): void => {
        if (!validateForm()) return;

        router.push('/TaxiType');
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <TouchableOpacity onPress={() => router.push("/(drawer)/Home")} style={styles.backButton}>
                            <ChevronLeft size={24} color="#000" style={styles.chevron} />
                        </TouchableOpacity>

                        <Text style={styles.title}>Book Your Ride</Text>
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.stopButton}
                            onPress={addStop}>
                            <Text style={styles.stopButtonText}>+ stop </Text>
                            <MapPin size={14} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Pickup Location</Text>
                    <View style={styles.inputWrapper}>
                        <MapPin size={16} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="From location"
                            value={pickupLocation || ''}
                            onChangeText={(text) => dispatch(setPickupLocation(text))}
                            placeholderTextColor="#666"
                        />
                    </View>

                    {stops.map((stop, index) => (
                        <View key={index}>
                            <Text style={styles.label}>Stop {index + 1}</Text>
                            <View style={styles.inputWrapper}>
                                <MapPin size={16} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder={`Stop ${index + 1}`}
                                    value={stop}
                                    onChangeText={(text) => updateStop(index, text)}
                                    placeholderTextColor="#666"
                                />
                                <TouchableOpacity style={styles.locationButton} onPress={() => removeStop(index)}>
                                    <Text style={styles.removeText}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}

                    <Text style={styles.label}>Drop Off Location</Text>
                    <View style={styles.inputWrapper}>
                        <MapPin size={16} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="To location"
                            value={dropLocation || ''}
                            onChangeText={(text) => dispatch(setDropLocation(text))}
                            placeholderTextColor="#666"
                        />
                    </View>

                    <Text style={styles.label}>Pick Up Date</Text>
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => setShowDatePicker(true)}>
                        <Calendar size={18} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateTimeText}>
                            {formatDate(currentDate)}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={currentDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onDateChange}
                            minimumDate={new Date()}
                        />
                    )}

                    <Text style={styles.label}>Pick Up Time</Text>
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => setShowTimePicker(true)}>
                        <Clock size={18} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateTimeText}>
                            {formatTime(currentTime)}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={currentTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onTimeChange}
                        />
                    )}

                    <TouchableOpacity
                        style={[styles.button, styles.returnButton]}
                        onPress={() => dispatch(setHasReturn(!hasReturn))}>
                        <Text style={styles.returnButtonText}>
                            {hasReturn ? 'REMOVE RETURN' : 'ADD RETURN'}
                        </Text>
                    </TouchableOpacity>

                    {hasReturn && (
                        <>
                            <Text style={styles.label}>Return Date</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => setShowReturnDatePicker(true)}>
                                <Calendar size={18} color="#666" style={styles.inputIcon} />
                                <Text style={styles.dateTimeText}>
                                    {formatDate(returnDateObj)}
                                </Text>
                            </TouchableOpacity>
                            {showReturnDatePicker && (
                                <DateTimePicker
                                    value={returnDateObj}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onReturnDateChange}
                                    minimumDate={currentDate}
                                />
                            )}

                            <Text style={styles.label}>Return Time</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => setShowReturnTimePicker(true)}>
                                <Clock size={18} color="#666" style={styles.inputIcon} />
                                <Text style={styles.dateTimeText}>
                                    {formatTime(returnTimeObj)}
                                </Text>
                            </TouchableOpacity>
                            {showReturnTimePicker && (
                                <DateTimePicker
                                    value={returnTimeObj}
                                    mode="time"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onReturnTimeChange}
                                />
                            )}
                        </>
                    )}

                    <Text style={styles.label}>Passengers</Text>
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => setShowPassengerModal(true)}>
                        <Users size={18} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateTimeText}>
                            {getTotalPassengers()} Passenger{getTotalPassengers() !== 1 ? 's' : ''}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.bookButton, isLoading && styles.disabledButton]}
                        onPress={bookRide}
                        disabled={isLoading}>
                        <Text style={styles.bookButtonText}>
                            {isLoading ? 'BOOKING...' : 'BOOK TAXI'}
                        </Text>
                        {!isLoading && <ArrowRight size={18} color="#FFF" />}
                    </TouchableOpacity>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showPassengerModal}
                    onRequestClose={() => setShowPassengerModal(false)}>
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPressOut={() => setShowPassengerModal(false)}
                    >
                        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
                            <Text style={styles.modalTitle}>Select Passengers</Text>

                            {localPassengers.map((passenger, index) => (
                                <View key={passenger.type} style={styles.passengerRow}>
                                    <View>
                                        <Text style={styles.passengerType}>{passenger.type}</Text>
                                        <Text style={styles.passengerAge}>{passenger.ageRange}</Text>
                                    </View>
                                    <View style={styles.counterContainer}>
                                        <TouchableOpacity
                                            style={styles.counterButton}
                                            onPress={() => handlePassengerChange(index, false)}>
                                            <Text style={styles.counterButtonText}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.counterText}>{passenger.count}</Text>
                                        <TouchableOpacity
                                            style={styles.counterButton}
                                            onPress={() => handlePassengerChange(index, true)}>
                                            <Text style={styles.counterButtonText}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={() => setShowPassengerModal(false)}>
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        backgroundColor: '#FFB300',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: '#FFB300',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerText: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    backButton: {
        marginRight: 15,
    },
    chevron: {
        marginTop: 3
    },
    removeText: {
        fontWeight: 'semibold',
        fontSize: 18,
        paddingRight: 5
    },
    dateTimeText: {
        flex: 1,
        fontSize: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    stopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 20,
    },
    counterButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    stopButtonText: {
        color: '#000',
        fontSize: 14,
        marginBottom: 3,
    },
    form: {
        flex: 1,
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000000',
        borderRadius: 36,
        paddingVertical: 12,
        justifyContent: 'center',
        marginTop: 25,
    },
    buttonDisabled: {
        backgroundColor: '#555555',
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 8,
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    locationIcon: {
        flex: 1,
        borderRadius: 36,
        paddingVertical: 8,
        paddingLeft: 2,
        fontSize: 14,
        outlineStyle: 'none',
        backgroundColor: '#fff'
    },
    location: {
        marginRight: 5
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    activeReturnButton: {
        backgroundColor: '#e0e0e0',
    },
    input: {
        flex: 1,
        borderRadius: 36,
        paddingLeft: 2,
        fontSize: 14,
        outlineStyle: 'none',
        backgroundColor: '#fff'
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 36,
        height: 42,
        backgroundColor: '#fff',
        paddingLeft: 15
    },
    dateInput: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    timeInput: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
    },
    inputIcon: {
        marginRight: 8,
    },
    locationButton: {
        padding: 8,
    },
    returnButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center'
    },
    returnButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 25
    },
    bookButtonText: {
        color: '#FFF',
        fontSize: 16,
        marginRight: 8,
    },
    passengerText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingLeft: 8,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    passengerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    passengerType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    passengerAge: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },

    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterButton: {
        width: 36,
        height: 36,
        backgroundColor: '#FFA500',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 16,
        minWidth: 24,
        textAlign: 'center',
    },
    confirmButton: {
        backgroundColor: '#FFA500',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 26,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});