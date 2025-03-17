// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
// import { ChevronRight, Bell, Moon, Shield, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

// export default function Settings() {
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Settings</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Account</Text>
        
//         <TouchableOpacity style={styles.settingItem}>
//           <View style={styles.settingLeft}>
//             <Bell {...{ size: 24, color: "#000" }} />
//             <Text style={styles.settingText}>Notifications</Text>
//           </View>
//           <Switch value={true} onValueChange={() => {}} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.settingItem}>
//           <View style={styles.settingLeft}>
//             <Moon {...{ size: 24, color: "#000" }} />
//             <Text style={styles.settingText}>Dark Mode</Text>
//           </View>
//           <Switch value={false} onValueChange={() => {}} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.settingItem}>
//           <View style={styles.settingLeft}>
//             <Shield {...{ size: 24, color: "#000" }} />
//             <Text style={styles.settingText}>Privacy</Text>
//           </View>
//           <ChevronRight {...{ size: 24, color: "#999" }} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Support</Text>
        
//         <TouchableOpacity style={styles.settingItem}>
//           <View style={styles.settingLeft}>
//             <HelpCircle {...{ size: 24, color: "#000" }} />
//             <Text style={styles.settingText}>Help Center</Text>
//           </View>
//           <ChevronRight {...{ size: 24, color: "#999" }} />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.settingItem}>
//           <View style={styles.settingLeft}>
//             <LogOut {...{ size: 24, color: "#ff444" }} />
//             <Text style={[styles.settingText, { color: '#ff4444' }]}>Log Out</Text>
//           </View>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.footer}>
//         <Text style={styles.version}>Version 1.0.0</Text>
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
//     backgroundColor: '#fff',
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   section: {
//     padding: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#666',
//     marginBottom: 16,
//   },
//   settingItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f1f1',
//   },
//   settingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   settingText: {
//     fontSize: 16,
//     color: '#000',
//   },
//   footer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   version: {
//     fontSize: 14,
//     color: '#999',
//   },
// });