import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProfile, updateProfile, resetUpdateProfileState } from '../../store/slices/updateProfileSlice';
import Toast from 'react-native-toast-message';
import { PencilLine, ChevronLeft, Save, User as UserIcon, CheckCircle, AlertCircle, ImageUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  address: yup.string().required('Address is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function Profile() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, success, error, fetchLoading, fetchError } = useAppSelector((state) => state.updateProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [localCusUid, setLocalCusUid] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
    },
  });
  const { fullname, email, username } = useSelector((state: RootState) => ({
    username: state.auth.user?.cus_username,
    fullname: state.auth.user?.cus_fullname,
    email: state.auth.user?.cus_email,
  }));
  // Get customer ID from AsyncStorage or Redux state
  useEffect(() => {
    const getCusUid = async () => {
      try {
        // Try to get cus_uid from AsyncStorage
        const storedCusUid = await AsyncStorage.getItem('cus_uid');
        console.log('cus_uid from AsyncStorage:', storedCusUid);

        if (storedCusUid) {
          setLocalCusUid(storedCusUid);
        } else if (user?.cus_uid) {
          // Fallback to Redux state
          console.log('cus_uid from Redux state:', user.cus_uid);
          setLocalCusUid(user.cus_uid.toString());
        } else {
          console.warn('No customer ID found in AsyncStorage or Redux state');
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Customer ID not found. Please login again.',
          });
        }
      } catch (error) {
        console.error('Error retrieving customer ID:', error);
      }
    };

    getCusUid();
  }, [user]);

  // Fetch user profile data when customer ID is available
  useEffect(() => {
    if (localCusUid) {
      console.log('Fetching user profile with cus_uid:', localCusUid);
      dispatch(fetchUserProfile(localCusUid))
        .then((result) => {
          console.log('Fetch complete, result action:', result);
        })
        .catch((err) => {
          console.error('Fetch failed:', err);
        });
    }
  }, [dispatch, localCusUid]);

  // Update form values when user data is available
// Update form values when user data is available
useEffect(() => {
  if (user) {
    console.log('User data received:', user);
    
    // Map all possible field names to form fields
    setValue('username', user.username || '');
    setValue('first_name', user.first_name || user.FirstName || '');
    setValue('last_name', user.last_name || user.LastName || '');
    setValue('email', user.email || user.Email || '');
    setValue('phone', user.phone || user.PhoneNo || '');
    setValue('address', user.address || user.Address || '');
    
    // Set profile image if available
    // if (user.profile_image || user.ProfileImage) {
    //   setProfileImage(user.profile_image || user.ProfileImage);
    // }
  }
}, [user, setValue]);

  // Show success toast when profile is updated
  useEffect(() => {
    if (success) {
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been successfully updated!',
        position: 'top',
        visibilityTime: 3000,
        topOffset: 40,
      });
      setIsEditing(false);
      dispatch(resetUpdateProfileState());
    }
  }, [success, dispatch]);

  // Show error toast when update fails
// In your component
useEffect(() => {
  if (error) {
    const errorMessage = typeof error === 'object' 
      ? JSON.stringify(error) 
      : error || 'Please try again later';
      
    Toast.show({
      type: 'error',
      text1: 'Update Failed',
      text2: errorMessage.substring(0, 100), // Limit length to avoid overflow
      position: 'top',
      visibilityTime: 4000,
      topOffset: 40,
    });
  }
}, [error]);

  // Show fetch error toast
  useEffect(() => {
    if (fetchError) {
      Toast.show({
        type: 'error',
        text1: 'Failed to Load Profile',
        text2: fetchError || 'Please try again later',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 40,
      });
    }
  }, [fetchError]);

  const onSubmit = (data: FormData) => {
    if (localCusUid) {
      dispatch(updateProfile({
        cus_uid: localCusUid,
        userData: {
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
        }
      }));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Customer ID not found',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 40,
      });
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };


  // Simulating image selection functionality
  const selectImage = () => {
    // In a real implementation, this would use image picker
    console.log('Select image clicked');
    // Placeholder for image picker functionality
    // Would need to use something like react-native-image-picker
  };

  // Render avatar or placeholder
  const renderAvatar = () => {
    if (profileImage) {
      return (
        <Image 
          source={{ uri: profileImage }} 
          style={styles.avatar} 
          resizeMode="cover" 
        />
      );
    } else {
      return (
        <View style={[styles.avatar, styles.placeholderAvatar]}>
          <UserIcon size={40} color="#AAAAAA" />
        </View>
      );
    }
  };

  if (fetchLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFCC00" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <TouchableOpacity onPress={toggleEditMode} style={styles.editButton}>
            <PencilLine size={20} color="#000" />
            <Text style={styles.editButtonText}>{isEditing ? 'Cancel' : 'Edit'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarContainer}>
          {renderAvatar()}
          <Pressable style={styles.imageBadge} onPress={selectImage}>
            <ImageUp size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.fieldsContainer}>
          <Controller
            control={control}
            name="username"
            render={() => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Username</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    value={username}
                    editable={false} 
                    placeholderTextColor="#999"
                  />
                </View>
                {errors.username && <Text style={styles.errorText}>{errors.username.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="first_name"
            render={() => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>First Name</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    value={fullname}
                    placeholderTextColor="#999"
                    editable={false} 
                  />
                </View>
                {errors.first_name && <Text style={styles.errorText}>{errors.first_name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Last Name</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Last Name"
                    placeholderTextColor="#999"
                    editable={isEditing}
                  />
                </View>
                {errors.last_name && <Text style={styles.errorText}>{errors.last_name.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={() => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    value={email}
                    placeholderTextColor="#999"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={false} 
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    keyboardType="phone-pad"
                    editable={isEditing}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Address</Text>
                <View style={styles.fieldValueContainer}>
                  <TextInput
                    style={styles.input}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Address"
                    placeholderTextColor="#999"
                    multiline
                    numberOfLines={2}
                    editable={isEditing}
                  />
                </View>
                {errors.address && <Text style={styles.errorText}>{errors.address.message}</Text>}
              </View>
            )}
          />
        </View>

        {isEditing && (
          <TouchableOpacity
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Save size={18} color="#fff" style={styles.saveIcon} />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
      <Toast config={{
        success: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, styles.successToast]}>
            <CheckCircle size={24} color="#4CAF50" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>{text1}</Text>
              <Text style={styles.toastMessage}>{text2}</Text>
            </View>
          </View>
        ),
        error: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, styles.errorToast]}>
            <AlertCircle size={24} color="#FF5252" />
            <View style={styles.toastTextContainer}>
              <Text style={styles.toastTitle}>{text1}</Text>
              <Text style={styles.toastMessage}>{text2}</Text>
            </View>
          </View>
        ),
      }} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 90,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB300',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginLeft: 10,
  },
  chevron: {
    marginTop: 3
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  editButtonText: {
    marginLeft: 8,
    color: '#000',
    fontWeight: 'bold',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 25,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  imageBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#34C759',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  fieldsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fieldValueContainer: {
    backgroundColor: '#F6F8FA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  input: {
    fontSize: 14,
    color: '#000',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    height: 56,
    borderRadius: 28,
  },
  saveButtonDisabled: {
    backgroundColor: '#AAA',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveIcon: {
    marginRight: 8,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successToast: {
    borderLeftColor: '#4CAF50',
    borderLeftWidth: 6,
  },
  errorToast: {
    borderLeftColor: '#FF5252',
    borderLeftWidth: 6,
  },
  toastTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  toastMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});