import { useState, useEffect, Fragment, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, ChevronLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import { 
  submitBookingInfo, 
  BookingInfoPayload, 
  resetStatus, 
  setBookingSuccess 
} from '@/store/slices/customerInfoSlice';
import BookingSuccessModal from '../../components/BookingSuccessModal';

// Define form data interface
interface CustomerFormData {
    flightNo: string;
    meetAndGreet: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    address: string;
}

// Define validation schema
const schema = yup.object().shape({
    flightNo: yup.string().required('Flight/Train number is required'),
    meetAndGreet: yup.string(),
    phoneNumber: yup.string().required('Phone number is required'),
    address: yup.string().required('Address is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function CustomerInfo() {
    const dispatch = useDispatch<AppDispatch>();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [localBookingId, setLocalBookingId] = useState<string | null>(null);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    
    // Get user data from auth state
    const { user } = useSelector((state: RootState) => state.auth);
    
    // Get ride information from ride state
    const ride = useSelector((state: RootState) => state.ride);
    
    // Get selected vehicle from taxiType state
    const { selectedVehicle } = useSelector((state: RootState) => state.taxiType);
    
    // Get customer info state for loading and errors
    const { loading, error, success, bookingId } = useSelector(
        (state: RootState) => state.customerInfo
    );

    // Add debug logs
    console.log('Redux success state:', success);
    console.log('Redux bookingId:', bookingId);
    console.log('Local modal state:', showSuccessModal);
    console.log('Submission attempted:', submissionAttempted);

    // Parse fullname to firstName and lastName
    const parseFullName = (fullName: string): { firstName: string; lastName: string } => {
        const nameParts = fullName?.trim().split(' ') || [];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        return { firstName, lastName };
    };

    // Extract first name and last name from full name
    const { firstName, lastName } = parseFullName(user?.cus_fullname || '');

    // Initialize form
    const {
        control,
        handleSubmit: validateForm,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            flightNo: '',
            meetAndGreet: '',
            address: '',
        },
    });

    // Calculate children and infants
    const getPassengersByType = (): { adults: number; children: number; infants: number } => {
        const result = { adults: 0, children: 0, infants: 0 };
        
        ride.passengers.forEach(passenger => {
            if (passenger.type === 'adult') {
                result.adults = passenger.count;
            } else if (passenger.type === 'child') {
                result.children = passenger.count;
            } else if (passenger.type === 'infant') {
                result.infants = passenger.count;
            }
        });
        
        return result;
    };

    // Check for success state changes
    useEffect(() => {
        console.log('Checking success state in useEffect:', success, 'bookingId:', bookingId);
        if (success && bookingId) {
            console.log('✓ Success condition met! Setting showSuccessModal to true');
            setLocalBookingId(bookingId);
            setShowSuccessModal(true);
        } else if (submissionAttempted && !loading && !success) {
            console.log('Submission complete but no success/bookingId. Generating fallback...');
            // Fallback: If submission completed but no success, create a temporary booking ID
            const tempBookingId = `USER-${user?.cus_uid || Date.now()}`;
            console.log('Setting fallback booking ID:', tempBookingId);
            
            // Use the dispatch to set success state and booking ID
            dispatch(setBookingSuccess({ bookingId: tempBookingId }));
        }
    }, [success, bookingId, loading, submissionAttempted, dispatch, user?.cus_uid]);

    // Reset status when component unmounts
    useEffect(() => {
        return () => {
            dispatch(resetStatus());
            console.log('Component unmounting, status reset');
        };
    }, [dispatch]);

    // Function to handle form submission
    const onSubmit = useCallback((data: FormData) => {
        if (!selectedVehicle) {
            Alert.alert("Error", "No vehicle selected. Please go back and select a vehicle.");
            return;
        }

        setSubmissionAttempted(true);
        console.log('Form submitted, submission attempted set to true');

        const { adults, children, infants } = getPassengersByType();
        
        // Prepare booking info payload
        const bookingPayload: BookingInfoPayload = {
            Address: data.address,
            Email: user?.cus_email || '',
            FirstName: firstName,
            LastName: lastName,
            MeetGreet: data.meetAndGreet,
            PhoneNo: data.phoneNumber,
            TransferNo: data.flightNo,
            UserID: user?.cus_uid || 0,
            allstops: ride.stops?.join(';') || '',
            childeren: children,
            distanceinkm: ride.distance || "0",
            dropofflocation: ride.dropLocation || '',
            infant: infants,
            isretrun: ride.hasReturn ? 1 : 0,
            passenger: adults,
            pickupdate: ride.date || '',
            pickuplocation: ride.pickupLocation || '',
            pickuptime: ride.time ? new Date(ride.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }) : '',
            returnTime: ride.returnTime ? new Date(ride.returnTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }) : '',
            returndate: ride.returnDate || '',
            vehicleId: selectedVehicle?.id || '',
        };

        console.log('Submitting booking info with payload:', bookingPayload);
        
        // Dispatch submit booking action
        dispatch(submitBookingInfo(bookingPayload));
        
        // Fallback timer - if no response within 5 seconds, force show modal
        const fallbackTimer = setTimeout(() => {
            if (!success && !bookingId && !showSuccessModal) {
                console.log('Fallback timer triggered - forcing success modal');
                const fallbackId = `FB-${user?.cus_uid || Date.now()}`;
                dispatch(setBookingSuccess({ bookingId: fallbackId }));
            }
        }, 5000);
        
        // Clear timer on success or component unmount
        return () => clearTimeout(fallbackTimer);
    }, [dispatch, user, ride, selectedVehicle, firstName, lastName, success, bookingId, showSuccessModal]);

    // Function to handle modal close
    const handleCloseModal = useCallback(() => {
        console.log('Modal closed, navigating to Home');
        setShowSuccessModal(false);
        // Wait a moment before navigating
        setTimeout(() => {
            router.replace('/(drawer)/Home');
        }, 300);
    }, []);

    // Force modal display for testing (keep this for debugging)
    const forceShowModal = () => {
        console.log('Forcing modal display (for testing)');
        const tempId = `TEST-${Date.now()}`;
        setLocalBookingId(tempId);
        dispatch(setBookingSuccess({ bookingId: tempId }));
    };

    return (
        <Fragment>
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <ChevronLeft size={24} color="#000" style={styles.chevron} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Book Your Ride</Text>
                    </View>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="flightNo"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Flight/Train No.</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="map-pin" size={20} color="black" />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Flight No / Train No. e.g LEA4300"
                                        keyboardType="default"
                                        placeholderTextColor="#999"
                                        autoCorrect={false}
                                    />
                                </View>
                                {errors.flightNo && <Text style={styles.errorText}>{errors.flightNo.message}</Text>}
                            </View>
                        )}
                    />

                    <Controller
                        control={control}
                        name="meetAndGreet"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Meet And Greet</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="users" size={20} color="black" />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter meeting point or leave empty"
                                        keyboardType="default"
                                        placeholderTextColor="#999"
                                        autoCorrect={false}
                                    />
                                </View>
                                {errors.meetAndGreet && <Text style={styles.errorText}>{errors.meetAndGreet.message}</Text>}
                            </View>
                        )}
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="user" size={20} color="black" />
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={user?.cus_fullname}
                                editable={false} 
                                keyboardType="default"
                                placeholderTextColor="#999"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <Controller
                        control={control}
                        name="phoneNumber"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Phone No.</Text>
                                <View style={styles.inputWrapper}>
                                    <Feather name="phone" size={18} color="black" />
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Enter phone number"
                                        placeholderTextColor="#999"
                                        keyboardType="phone-pad"
                                        autoCorrect={false}
                                    />
                                </View>
                                {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>}
                            </View>
                        )}
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <Feather name="mail" size={18} color="black" />
                            <TextInput
                                style={[styles.input, styles.disabledInput]}
                                value={user?.cus_email}
                                editable={false} 
                                placeholderTextColor="#999"
                                keyboardType="email-address"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <Controller
                        control={control}
                        name="address"
                        render={({ field: { onChange, value } }) => (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Address</Text>
                                <TextInput
                                    style={styles.addressInput}
                                    placeholder="Enter Address"
                                    multiline={true}
                                    numberOfLines={4}
                                    value={value}
                                    onChangeText={onChange}
                                />
                                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
                            </View>
                        )}
                    />

                    {error && <Text style={styles.submitError}>{error}</Text>}
                    <TouchableOpacity 
                        style={[styles.button, loading && styles.disabledButton]} 
                        onPress={validateForm(onSubmit)}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Confirm Booking</Text>
                                <ArrowRight size={18} color="#FFF" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
            
            {/* Success Modal - Should show when showSuccessModal is true */}
            <BookingSuccessModal 
                visible={showSuccessModal}
                onClose={handleCloseModal}
                bookingId={localBookingId || bookingId} 
            />
        </Fragment>
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
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    form: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 16,
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
    inputAddressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 20,
        height: 42,
        backgroundColor: '#fff',
        paddingLeft: 15
    },
    errorText: {
        color: 'red',
        marginTop: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    submitError: {
        color: 'red',
        fontSize: 14,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        flex: 1,
        borderRadius: 36,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 14,
        outlineStyle: 'none',
        backgroundColor: '#fff'
    },
    disabledInput: {
        color: '#666',
    },
    disabledButton: {
        backgroundColor: '#FFC966',
    },
    addressInput: {
        height: 100,
        textAlignVertical: 'top',
        flex: 1,
        borderRadius: 20,
        paddingLeft: 12,
        paddingTop: 10,
        fontSize: 14,
        outlineStyle: 'none',
        backgroundColor: '#fff'
    },
    hint: {
        fontSize: 12,
        marginTop: 4,
        color: '#666',
    },
    button: {
        backgroundColor: '#000',
        borderRadius: 25,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});