// import React, { useState, useEffect } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   Modal, 
//   StyleSheet, 
//   Platform, 
//   ScrollView,
//   Dimensions,
//   TextInput
// } from 'react-native';

// // TypeScript interfaces
// interface CrossPlatformPickerProps {
//   value?: Date;
//   onChange: (date: Date) => void;
//   mode?: 'date' | 'time' | 'datetime';
//   title?: string;
//   confirmText?: string;
//   cancelText?: string;
// }

// /**
//  * A cross-platform date/time picker that works on Web and Expo Go
//  */
// const CrossPlatformPicker: React.FC<CrossPlatformPickerProps> = ({ 
//   value = new Date(),
//   onChange,
//   mode = 'datetime', // 'date', 'time', or 'datetime'
//   title = 'Select Date & Time',
//   confirmText = 'Confirm',
//   cancelText = 'Cancel'
// }) => {
//   const [isVisible, setIsVisible] = useState<boolean>(false);
//   const [tempValue, setTempValue] = useState<Date>(new Date(value));
//   const [displayValue, setDisplayValue] = useState<string>('');
  
//   // For web native date/time input
//   const [webInputValue, setWebInputValue] = useState<string>('');
  
//   useEffect(() => {
//     // Format the date for display
//     if (value) {
//       let formattedValue = '';
//       if (mode === 'date' || mode === 'datetime') {
//         formattedValue = value.toLocaleDateString();
//       }
//       if (mode === 'time' || mode === 'datetime') {
//         const timeStr = value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//         formattedValue = formattedValue ? `${formattedValue}, ${timeStr}` : timeStr;
//       }
//       setDisplayValue(formattedValue);
      
//       // Format for web input
//       if (mode === 'date') {
//         setWebInputValue(formatDateForInput(value));
//       } else if (mode === 'time') {
//         setWebInputValue(formatTimeForInput(value));
//       } else {
//         setWebInputValue(formatDateTimeForInput(value));
//       }
//     }
//   }, [value, mode]);
  
//   const formatDateForInput = (date: Date): string => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };
  
//   const formatTimeForInput = (date: Date): string => {
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${hours}:${minutes}`;
//   };
  
//   const formatDateTimeForInput = (date: Date): string => {
//     return `${formatDateForInput(date)}T${formatTimeForInput(date)}`;
//   };
  
//   const handleConfirm = (): void => {
//     onChange(tempValue);
//     setIsVisible(false);
//   };
  
//   const handleWebInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
//     const inputValue = e.target.value;
//     setWebInputValue(inputValue);
    
//     if (inputValue) {
//       const newDate = new Date(inputValue);
//       if (!isNaN(newDate.getTime())) {
//         setTempValue(newDate);
//         onChange(newDate);
//       }
//     }
//   };
  
//   const renderIOSAndroidPicker = (): React.ReactNode => {
//     // Data for the picker
//     const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
//     const months = [
//       'January', 'February', 'March', 'April', 'May', 'June',
//       'July', 'August', 'September', 'October', 'November', 'December'
//     ];
//     const daysInMonth = new Date(
//       tempValue.getFullYear(), 
//       tempValue.getMonth() + 1, 
//       0
//     ).getDate();
//     const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
//     const hours = Array.from({ length: 24 }, (_, i) => i);
//     const minutes = Array.from({ length: 60 }, (_, i) => i);
    
//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isVisible}
//         onRequestClose={() => setIsVisible(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>{title}</Text>
            
//             <View style={styles.pickerContainer}>
//               {(mode === 'date' || mode === 'datetime') && (
//                 <>
//                   <View style={styles.pickerColumn}>
//                     <Text style={styles.pickerLabel}>Month</Text>
//                     <ScrollView style={styles.pickerScrollView}>
//                       {months.map((month, index) => (
//                         <TouchableOpacity
//                           key={month}
//                           style={[
//                             styles.pickerItem,
//                             tempValue.getMonth() === index && styles.pickerItemSelected
//                           ]}
//                           onPress={() => {
//                             const newDate = new Date(tempValue);
//                             newDate.setMonth(index);
//                             // Adjust for invalid dates (e.g., Feb 30)
//                             if (newDate.getMonth() !== index) {
//                               newDate.setDate(0);
//                             }
//                             setTempValue(newDate);
//                           }}
//                         >
//                           <Text 
//                             style={[
//                               styles.pickerItemText,
//                               tempValue.getMonth() === index && styles.pickerItemTextSelected
//                             ]}
//                           >
//                             {month}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
                  
//                   <View style={styles.pickerColumn}>
//                     <Text style={styles.pickerLabel}>Day</Text>
//                     <ScrollView style={styles.pickerScrollView}>
//                       {days.map(day => (
//                         <TouchableOpacity
//                           key={day}
//                           style={[
//                             styles.pickerItem,
//                             tempValue.getDate() === day && styles.pickerItemSelected
//                           ]}
//                           onPress={() => {
//                             const newDate = new Date(tempValue);
//                             newDate.setDate(day);
//                             setTempValue(new Date(newDate));
//                           }}
//                         >
//                           <Text 
//                             style={[
//                               styles.pickerItemText,
//                               tempValue.getDate() === day && styles.pickerItemTextSelected
//                             ]}
//                           >
//                             {day}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
                  
//                   <View style={styles.pickerColumn}>
//                     <Text style={styles.pickerLabel}>Year</Text>
//                     <ScrollView style={styles.pickerScrollView}>
//                       {years.map(year => (
//                         <TouchableOpacity
//                           key={year}
//                           style={[
//                             styles.pickerItem,
//                             tempValue.getFullYear() === year && styles.pickerItemSelected
//                           ]}
//                           onPress={() => {
//                             const newDate = new Date(tempValue);
//                             newDate.setFullYear(year);
//                             setTempValue(new Date(newDate));
//                           }}
//                         >
//                           <Text 
//                             style={[
//                               styles.pickerItemText,
//                               tempValue.getFullYear() === year && styles.pickerItemTextSelected
//                             ]}
//                           >
//                             {year}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 </>
//               )}
              
//               {(mode === 'time' || mode === 'datetime') && (
//                 <>
//                   <View style={styles.pickerColumn}>
//                     <Text style={styles.pickerLabel}>Hour</Text>
//                     <ScrollView style={styles.pickerScrollView}>
//                       {hours.map(hour => (
//                         <TouchableOpacity
//                           key={hour}
//                           style={[
//                             styles.pickerItem,
//                             tempValue.getHours() === hour && styles.pickerItemSelected
//                           ]}
//                           onPress={() => {
//                             const newDate = new Date(tempValue);
//                             newDate.setHours(hour);
//                             setTempValue(new Date(newDate));
//                           }}
//                         >
//                           <Text 
//                             style={[
//                               styles.pickerItemText,
//                               tempValue.getHours() === hour && styles.pickerItemTextSelected
//                             ]}
//                           >
//                             {hour < 10 ? `0${hour}` : hour}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
                  
//                   <View style={styles.pickerColumn}>
//                     <Text style={styles.pickerLabel}>Minute</Text>
//                     <ScrollView style={styles.pickerScrollView}>
//                       {minutes.map(minute => (
//                         <TouchableOpacity
//                           key={minute}
//                           style={[
//                             styles.pickerItem,
//                             tempValue.getMinutes() === minute && styles.pickerItemSelected
//                           ]}
//                           onPress={() => {
//                             const newDate = new Date(tempValue);
//                             newDate.setMinutes(minute);
//                             setTempValue(new Date(newDate));
//                           }}
//                         >
//                           <Text 
//                             style={[
//                               styles.pickerItemText,
//                               tempValue.getMinutes() === minute && styles.pickerItemTextSelected
//                             ]}
//                           >
//                             {minute < 10 ? `0${minute}` : minute}
//                           </Text>
//                         </TouchableOpacity>
//                       ))}
//                     </ScrollView>
//                   </View>
//                 </>
//               )}
//             </View>
            
//             <View style={styles.buttonContainer}>
//               <TouchableOpacity
//                 style={[styles.button, styles.cancelButton]}
//                 onPress={() => setIsVisible(false)}
//               >
//                 <Text style={styles.cancelButtonText}>{cancelText}</Text>
//               </TouchableOpacity>
              
//               <TouchableOpacity
//                 style={[styles.button, styles.confirmButton]}
//                 onPress={handleConfirm}
//               >
//                 <Text style={styles.confirmButtonText}>{confirmText}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     );
//   };
  
//   // For web, we'll use the native input elements
//   const renderWebInput = (): React.ReactNode => {
//     if (Platform.OS === 'web') {
//       let inputType: string;
//       if (mode === 'date') {
//         inputType = 'date';
//       } else if (mode === 'time') {
//         inputType = 'time';
//       } else {
//         inputType = 'datetime-local';
//       }
      
//       // Use React Native Web's way of rendering HTML elements
//       return (
//         <TextInput
//           style={{
//             position: 'absolute',
//             opacity: 0,
//             width: '100%',
//             height: '100%',
//             top: 0,
//             left: 0,
//           }}
//           value={webInputValue}
//           onChange={(e) => {
//             if (Platform.OS === 'web') {
//               // @ts-ignore - This is safe for web only
//               handleWebInputChange(e);
//             }
//           }}
//           // @ts-ignore - Web-specific props
//           type={inputType}
//         />
//       );
//     }
//     return null;
//   };
  
//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.inputContainer}
//         onPress={() => setIsVisible(true)}
//       >
//         <Text style={displayValue ? styles.inputText : styles.placeholderText}>
//           {displayValue || title}
//         </Text>
//         {renderWebInput()}
//       </TouchableOpacity>
      
//       {/* Render the custom modal picker for iOS and Android */}
//       {(Platform.OS === 'ios' || Platform.OS === 'android') && renderIOSAndroidPicker()}
//     </View>
//   );
// };

// /**
//  * Example usage component
//  */
// export default function DateTimePicker(): React.ReactNode {
//   const [date, setDate] = useState<Date>(new Date());
//   const [time, setTime] = useState<Date>(new Date());
//   const [dateTime, setDateTime] = useState<Date>(new Date());
  
//   return (
//     <View style={styles.exampleContainer}>
//       <Text style={styles.header}>Cross-Platform Date & Time Picker</Text>
      
//       <Text style={styles.label}>Date Only:</Text>
//       <CrossPlatformPicker
//         mode="date"
//         value={date}
//         onChange={setDate}
//         title="Select Date"
//       />
      
//       <Text style={styles.selectedValue}>
//         Selected: {date.toLocaleDateString()}
//       </Text>
      
//       <Text style={styles.label}>Time Only:</Text>
//       <CrossPlatformPicker
//         mode="time"
//         value={time}
//         onChange={setTime}
//         title="Select Time"
//       />
      
//       <Text style={styles.selectedValue}>
//         Selected: {time.toLocaleTimeString()}
//       </Text>
      
//       <Text style={styles.label}>Date & Time:</Text>
//       <CrossPlatformPicker
//         mode="datetime"
//         value={dateTime}
//         onChange={setDateTime}
//         title="Select Date & Time"
//       />
      
//       <Text style={styles.selectedValue}>
//         Selected: {dateTime.toLocaleString()}
//       </Text>
      
//       <View style={styles.infoCard}>
//         <Text style={styles.infoTitle}>How It Works</Text>
//         <Text style={styles.infoText}>
//           • On Web: Uses native HTML date/time inputs{'\n'}
//           • On Mobile: Uses custom scrollable picker{'\n'}
//           • Works in Expo Go without native modules{'\n'}
//           • Supports date, time or datetime modes
//         </Text>
//       </View>
//     </View>
//   );
// }

// const { width } = Dimensions.get('window');
// const isSmallDevice = width < 375;

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     marginVertical: 8,
//   },
//   inputContainer: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     padding: 12,
//     position: 'relative',
//     backgroundColor: 'white',
//   },
//   inputText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#999',
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     maxHeight: '80%',
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 16,
//     color: '#333',
//   },
//   pickerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   pickerColumn: {
//     flex: 1,
//     marginHorizontal: 4,
//   },
//   pickerLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//     marginBottom: 8,
//     color: '#666',
//   },
//   pickerScrollView: {
//     height: 200,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 8,
//   },
//   pickerItem: {
//     padding: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   pickerItemText: {
//     fontSize: isSmallDevice ? 14 : 16,
//   },
//   pickerItemSelected: {
//     backgroundColor: '#e6f7ff',
//   },
//   pickerItemTextSelected: {
//     color: '#1890ff',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 16,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },
//   cancelButton: {
//     backgroundColor: '#f5f5f5',
//     borderWidth: 1,
//     borderColor: '#d9d9d9',
//   },
//   confirmButton: {
//     backgroundColor: '#1890ff',
//   },
//   cancelButtonText: {
//     color: '#666',
//     fontSize: 16,
//   },
//   confirmButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '500',
//   },
  
//   // Example component styles
//   exampleContainer: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 24,
//     textAlign: 'center',
//     color: '#333',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
//     marginBottom: 8,
//     color: '#333',
//   },
//   selectedValue: {
//     fontSize: 16,
//     marginTop: 8,
//     marginBottom: 16,
//     padding: 8,
//     backgroundColor: '#fff',
//     borderRadius: 4,
//     borderLeftWidth: 4,
//     borderLeftColor: '#1890ff',
//   },
//   infoCard: {
//     marginTop: 32,
//     padding: 16,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   infoTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//   },
//   infoText: {
//     fontSize: 14,
//     lineHeight: 20,
//     color: '#666',
//   },
// });