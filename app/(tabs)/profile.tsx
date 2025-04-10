import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { PencilLine, CircleCheck as CheckCircle2, ImageUp } from 'lucide-react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '@/components/BottomNav';

interface ProfileField {
  label: string;
  value: string;
  isVerified?: boolean;
}

export default function Profile() {
  const [profileImage, setProfileImage] = useState<string | null>(null);(
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400"
  );

  const profileFields: ProfileField[] = [
    { label: 'Full Name', value: 'Muhammad Fawad Iqbal' },
    { label: 'Email', value: 'fawadiqbal274@gmail.com', isVerified: true },
    { label: 'Phone number', value: '+92 3334513912' },
  ];

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets?.[0]?.uri ?? null);

      }
    });
  };

  const renderField = ({ label, value, isVerified }: ProfileField) => (
    <View key={label} style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldValueContainer}>
        <View style={styles.valueWrapper}>
          <Text style={styles.fieldValue}>{value}</Text>
          {isVerified && (
            <View style={styles.verifiedContainer}>
              <CheckCircle2 size={12} color="#34C759" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>
        <Pressable style={styles.editButton}>
          <PencilLine size={16} color="#666" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.title}>Your profile</Text>

        <View style={styles.avatarContainer}>
        <Image source={{ uri: profileImage as string }} style={styles.avatar} resizeMode="cover" />

          <Pressable style={styles.verifiedBadge} onPress={selectImage}>
            <ImageUp size={16} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.fieldsContainer}>
          {profileFields.map(renderField)}
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB300',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  verifiedBadge: {
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
    marginHorizontal: 10,
  },
  fieldContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  fieldValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  valueWrapper: {
    flex: 1,
  },
  fieldValue: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
  },
  editButton: {
    padding: 8,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 10,
    color: '#34C759',
    marginLeft: 4,
  },
});

