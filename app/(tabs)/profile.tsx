// import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';

// export default function Profile() {
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.settingsButton}>
//         <Settings {...{ size: 24, color: "#000" }} />

//         </TouchableOpacity>
//       </View>

//       <View style={styles.profileSection}>
//         <View style={styles.avatarContainer}>
//           <Image
//             source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200' }}
//             style={styles.avatar}
//           />
//           <TouchableOpacity style={styles.editButton}>
//           <Edit2 {...{ size: 20, color: "#fff" }} />
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.name}>John Doe</Text>
//         <Text style={styles.bio}>Software Developer | React Native Expert</Text>
//         <TouchableOpacity style={styles.shareButton}>
//         <Share2 {...{ size: 20, color: "#000" }} />
//           <Text style={styles.shareText}>Share Profile</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.statsContainer}>
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>128</Text>
//           <Text style={styles.statLabel}>Posts</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>5.2K</Text>
//           <Text style={styles.statLabel}>Followers</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.statItem}>
//           <Text style={styles.statNumber}>482</Text>
//           <Text style={styles.statLabel}>Following</Text>
//         </View>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Recent Activity</Text>
//         {[1, 2, 3].map((item) => (
//           <View key={item} style={styles.activityCard}>
//             <Text style={styles.activityTitle}>Activity {item}</Text>
//             <Text style={styles.activityTime}>2 hours ago</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     padding: 20,
//     paddingTop: 60,
//     alignItems: 'flex-end',
//   },
//   settingsButton: {
//     padding: 8,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 12,
//   },
//   profileSection: {
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   avatarContainer: {
//     position: 'relative',
//     marginBottom: 16,
//   },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   editButton: {
//     position: 'absolute',
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#000',
//     padding: 8,
//     borderRadius: 20,
//   },
//   name: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#000',
//   },
//   bio: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginBottom: 16,
//   },
//   shareButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     padding: 12,
//     borderRadius: 20,
//     gap: 8,
//   },
//   shareText: {
//     fontSize: 16,
//     color: '#000',
//     fontWeight: '500',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 24,
//     paddingHorizontal: 40,
//     marginTop: 24,
//     backgroundColor: '#f9f9f9',
//   },
//   statItem: {
//     alignItems: 'center',
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#000',
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statDivider: {
//     width: 1,
//     backgroundColor: '#ddd',
//   },
//   section: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#000',
//   },
//   activityCard: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#f1f1f1',
//   },
//   activityTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//     color: '#000',
//   },
//   activityTime: {
//     fontSize: 14,
//     color: '#666',
//   },
// });