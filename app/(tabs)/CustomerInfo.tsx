import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ArrowRight, Check, ChevronLeft } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Feather } from '@expo/vector-icons';

interface BookingForm {
    flightNo: string;
    meetAndGreet: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    address: string;
}
const schema = yup.object().shape({
    name: yup.string().required('Name is required'),
    phone: yup.string().required('Phone number is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;
export default function CustomerInfo() {
    const [formData, setFormData] = useState<BookingForm>({
        flightNo: '',
        meetAndGreet: '',
        fullName: '',
        email: '',
        mobileNumber: '',
        address: '',
    });
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: { name: '', phone: '', email: '', password: '' },
    });
    //   const handleSubmit = () => {
    //     // Here you would typically make an API call to submit the booking
    //     router.push('./BookingSuccess.tsx');
    //   };

    return (
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
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Flight No.</Text>
                            <View style={styles.inputWrapper}>
                                <Feather size={20} color="black" />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Flight No  /  Train No. e.g LEA4300"
                                    keyboardType="default"
                                    placeholderTextColor="#999"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Meet And Greet</Text>
                            <View style={styles.inputWrapper}>
                                <Feather size={20} color="black" />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Flight No  /  Train No. e.g LEA4300"
                                    keyboardType="default"
                                    placeholderTextColor="#999"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="user" size={20} color="black" />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter name"
                                    keyboardType="default"
                                    placeholderTextColor="#999"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone No.</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="phone" size={18} />
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
                            {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
                        </View>
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Feather name="mail" size={18} />
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder="Enter email"
                                    placeholderTextColor="#999"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
                        </View>
                    )}
                />

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Address</Text>
                    <TextInput
                        style={styles.addressInput}
                        placeholder="Enter Address"
                        multiline={true}
                        numberOfLines={4}
                        value={formData.address}
                        onChangeText={(text) => setFormData({ ...formData, address: text })}
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>BOOK NOW</Text>
                    <ArrowRight size={18} color="#FFF" />
                </TouchableOpacity>
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
    input: {
        flex: 1,
        borderRadius: 36,
        paddingLeft: 10,
        fontSize: 14,
        outlineStyle: 'none',
        backgroundColor: '#fff'
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