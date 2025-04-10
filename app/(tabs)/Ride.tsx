import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Platform, Modal } from 'react-native';
import { MapPin, ArrowRight, Users, Calendar, Clock, Crosshair, Map, Plus, Minus } from 'lucide-react-native';
import { Link } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

type DateTimePickerEventType = {
    type: string;
    nativeEvent: {
        timestamp?: number;
    };
};

type PassengerCategory = {
    type: string;
    ageRange: string;
    count: number;
};

export default function Ride() {
    const [pickupLocation, setPickupLocation] = useState<string>('');
    const [dropLocation, setDropLocation] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [time, setTime] = useState<Date>(new Date());
    const [returnDate, setReturnDate] = useState<Date>(new Date());
    const [returnTime, setReturnTime] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
    const [showReturnDatePicker, setShowReturnDatePicker] = useState<boolean>(false);
    const [showReturnTimePicker, setShowReturnTimePicker] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasReturn, setHasReturn] = useState(false);
    const [showPassengerModal, setShowPassengerModal] = useState(false);
    const [passengers, setPassengers] = useState<PassengerCategory[]>([
        { type: 'Adults', ageRange: '12+ years', count: 0 },
        { type: 'Children', ageRange: '2-12 years', count: 0 },
        { type: 'Infants', ageRange: '0-2 years', count: 0 },
    ]);

    // Fix for "Type 'string' is not assignable to type 'never'" error
    const [stops, setStops] = useState<Array<string>>([]);

    // Format date for display
    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time for display
    const formatTime = (time: Date): string => {
        return time.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle date picker changes - using _ to indicate unused parameter
    const onDateChange = (_: DateTimePickerEventType, selectedDate?: Date): void => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    // Handle time picker changes - using _ to indicate unused parameter
    const onTimeChange = (_: DateTimePickerEventType, selectedTime?: Date): void => {
        setShowTimePicker(false);
        if (selectedTime) {
            setTime(selectedTime);
        }
    };

    // Handle return date picker changes - using _ to indicate unused parameter
    const onReturnDateChange = (_: DateTimePickerEventType, selectedDate?: Date): void => {
        setShowReturnDatePicker(false);
        if (selectedDate) {
            setReturnDate(selectedDate);
        }
    };

    // Handle return time picker changes - using _ to indicate unused parameter
    const onReturnTimeChange = (_: DateTimePickerEventType, selectedTime?: Date): void => {
        setShowReturnTimePicker(false);
        if (selectedTime) {
            setReturnTime(selectedTime);
        }
    };

    // Add a stop
    const addStop = (): void => {
        if (stops.length < 3) {
            setStops([...stops, '']);
        } else {
            Alert.alert('Maximum Stops', 'You can add a maximum of 3 stops.');
        }
    };

    // Update stop location - explicit types for parameters
    const updateStop = (index: number, value: string): void => {
        // Fix for "const newStops: never[]" error
        const newStops: Array<string> = [...stops];
        newStops[index] = value;
        setStops(newStops);
    };

    // Remove a stop - explicit type for parameter
    const removeStop = (index: number): void => {
        // Fix for "const newStops: never[]" error
        const newStops: Array<string> = [...stops];
        newStops.splice(index, 1);
        setStops(newStops);
    };

    // Get current location (mock implementation)
    const getCurrentLocation = (): void => {
        // In a real app, you would use Expo's Location API
        Alert.alert('Location Access', 'Getting your current location...');
        setTimeout(() => {
            setPickupLocation('Current Location');
        }, 1000);
    };

    // Open map to select location (mock implementation)
    const openMap = (): void => {
        Alert.alert('Map Selection', 'Opening map to select destination...');
        // In a real app, you would integrate with a map picker component
    };

    // Validate booking form
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
            // Check if return date/time is after initial date/time
            const pickupDateTime = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.getHours(),
                time.getMinutes()
            );

            const returnDateTime = new Date(
                returnDate.getFullYear(),
                returnDate.getMonth(),
                returnDate.getDate(),
                returnTime.getHours(),
                returnTime.getMinutes()
            );

            if (returnDateTime <= pickupDateTime) {
                Alert.alert('Error', 'Return time must be after pickup time');
                return false;
            }
        }
        return true;
    };

    const handlePassengerChange = (index: number, increment: boolean) => {
        setPassengers(prev => prev.map((passenger, i) => {
            if (i === index) {
                const newCount = increment ? passenger.count + 1 : Math.max(0, passenger.count - 1);
                return { ...passenger, count: newCount };
            }
            return passenger;
        }));
    };

    const getTotalPassengers = () => {
        return passengers.reduce((sum, passenger) => sum + passenger.count, 0);
    };

    // Book a ride
    const bookRide = (): void => {
        if (!validateForm()) return;

        setIsLoading(true);

        // Create booking object
        const bookingDetails = {
            pickupLocation,
            dropLocation,
            stops,
            pickupDate: formatDate(date),
            pickupTime: formatTime(time),
            passengers: getTotalPassengers(),
            passengerDetails: passengers,
            hasReturn,
            returnDate: hasReturn ? formatDate(returnDate) : null,
            returnTime: hasReturn ? formatTime(returnTime) : null,
        };

        console.log('Booking submitted:', bookingDetails);

        // Mock API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                'Booking Successful',
                `Your ride from ${pickupLocation} to ${dropLocation} has been booked for ${formatDate(date)} at ${formatTime(time)}.`,
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Reset form or navigate to confirmation screen
                            // In a real app, you'd navigate to a confirmation screen
                            // navigation.navigate('BookingConfirmation', { bookingDetails });
                        }
                    }
                ]
            );
        }, 2000);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Book Your Ride</Text>
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={addStop}>
                        <Text style={styles.stopButtonText}>+ stop </Text>
                        <MapPin size={14} color="#000000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={styles.label}>Pickup Location</Text>
                    <View style={styles.inputWrapper}>
                        <MapPin size={16} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="From location"
                            value={pickupLocation}
                            onChangeText={setPickupLocation}
                            placeholderTextColor="#666"
                        />
                        <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
                            <Crosshair size={18} color="#000" style={styles.location} />
                        </TouchableOpacity>
                    </View>

                    {/* Display added stops */}
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
                            value={dropLocation}
                            onChangeText={setDropLocation}
                            placeholderTextColor="#666"
                        />
                        <TouchableOpacity style={styles.locationButton} onPress={openMap}>
                            <Map size={18} color="#000" style={styles.location} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.label}>Pick Up Date</Text>
                    <TouchableOpacity
                        style={styles.inputWrapper}
                        onPress={() => setShowDatePicker(true)}>
                        <Calendar size={18} color="#666" style={styles.inputIcon} />
                        <Text style={styles.dateTimeText}>
                            {formatDate(date)}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
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
                            {formatTime(time)}
                        </Text>
                    </TouchableOpacity>
                    {showTimePicker && (
                        <DateTimePicker
                            value={time}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={onTimeChange}
                        />
                    )}

                    <TouchableOpacity
                        style={[styles.button, styles.returnButton]}
                        onPress={() => setHasReturn(!hasReturn)}>
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
                                    {formatDate(returnDate)}
                                </Text>
                            </TouchableOpacity>
                            {showReturnDatePicker && (
                                <DateTimePicker
                                    value={returnDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onReturnDateChange}
                                    minimumDate={date}
                                />
                            )}

                            <Text style={styles.label}>Return Time</Text>
                            <TouchableOpacity
                                style={styles.inputWrapper}
                                onPress={() => setShowReturnTimePicker(true)}>
                                <Clock size={18} color="#666" style={styles.inputIcon} />
                                <Text style={styles.dateTimeText}>
                                    {formatTime(returnTime)}
                                </Text>
                            </TouchableOpacity>
                            {showReturnTimePicker && (
                                <DateTimePicker
                                    value={returnTime}
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
                        {!isLoading && <ArrowRight size={20} color="#FFF" />}
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

                            {passengers.map((passenger, index) => (
                                <View key={passenger.type} style={styles.passengerRow}>
                                    <View>
                                        <Text style={styles.passengerType}>{passenger.type}</Text>
                                        <Text style={styles.passengerAge}>{passenger.ageRange}</Text>
                                    </View>
                                    <View style={styles.counterContainer}>
                                        <TouchableOpacity
                                            style={styles.counterButton}
                                            onPress={() => handlePassengerChange(index, false)}>
                                            <Minus size={20} color="#000" />
                                        </TouchableOpacity>
                                        <Text style={styles.counterText}>{passenger.count}</Text>
                                        <TouchableOpacity
                                            style={styles.counterButton}
                                            onPress={() => handlePassengerChange(index, true)}>
                                            <Plus size={20} color="#000" />
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
        fontSize: 24,
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
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 16,
        paddingRight: 16,
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
        paddingVertical: 15,
        alignItems: 'center'
    },
    returnButtonText: {
        color: '#FFF',
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: '#000',
        borderRadius: 25,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
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
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    confirmButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
    },
});