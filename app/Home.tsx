import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, FlatListProps, Image, TouchableOpacity, View, Text, NativeSyntheticEvent, NativeScrollEvent, ListRenderItem, StyleSheet } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

interface FlightItem {
    id: number;
    image: any;
    text: string;
    secondText?: string;
}
type RootStackParamList = {
    Home: undefined;
    Signup: undefined;
    // Add other routes here
  };
  
// Create an animated version of FlatList
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ForwardRefExoticComponent<
    FlatListProps<FlightItem> & React.RefAttributes<FlatList<FlightItem>>
>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
const Home: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const flatlistRef = useRef<FlatList<FlightItem>>(null);
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [items, setItems] = useState<FlightItem[]>([]);
    const scrollX = useRef(new Animated.Value(0)).current;

    const slideClicked = (item: FlightItem): void => {
        console.log(`Slide ${item.id} clicked`);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
            setActiveIndex(newIndex);
        }
    };

    const renderItem: ListRenderItem<FlightItem> = ({ item, index }) => {
        return (
            <View style={{ width: screenWidth, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => slideClicked(item)}>
                    <Image
                        source={item.image}
                        style={{ width: screenWidth - 40, borderRadius: 20 }}
                        accessible={true}
                        accessibilityLabel={`Flight slide ${index + 1}`}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
        );
    };

    const renderBarIndicators = () => {
        return items.map((bar, index) => (
            <View
                key={`bar-${index}`}
                style={{
                    height: 3,
                    width: 30,
                    borderRadius: 10,
                    marginHorizontal: 6,
                    backgroundColor: activeIndex === index ? 'white' : 'black'
                }}
                accessible={true}
                accessibilityLabel={`Slide indicator ${index + 1} of ${items.length}`}
                accessibilityState={{ selected: activeIndex === index }}
            />
        ));
    };

    // Modified to render each word with custom styling
    const renderStyledText = (text: string, secondText?: string, itemId?: number) => {
        const words = text.split(' ');
        
        return (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                {/* First text */}
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {words.map((word, index) => {
                        let wordColor = '#000000'; // Default black
                        let fontStyle: 'normal' | 'italic' = 'normal';
    
                        // Remove punctuation for clean comparison
                        const cleanWord = word.replace(/[^\w]/g, '');
                        console.log('Clean word:', cleanWord); // Debug log
                        if (itemId === 0 && cleanWord.toLowerCase() === 'tripzip') {
                            wordColor = '#FFFFFF';
                            fontStyle = 'italic';
                        }
                        
                        const wordStyles = {
                            fontSize: 26,
                            color: wordColor,
                            fontStyle: fontStyle,
                            fontFamily: 'PlusJakartaSans-Bold', // Apply Plus Jakarta Sans font
                            marginHorizontal: 3,
                            marginVertical: 2,
                            fontWeight: 'bold'
                        };
    
                        return (
                            <Text key={`word-${index}`} style={wordStyles}>
                                {word}
                                {index < words.length - 1 ? ' ' : ''}
                            </Text>
                        );
                    })}
                </View>
    
                {/* Second text */}
                {secondText && (
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                        {secondText.split(' ').map((word, index) => {
let wordColor = '#000000'; // Default color

if (itemId === 0 || itemId === 1) {
    wordColor = '#FFFFFF';
} else if (itemId === 2) {
    wordColor = '#858585';
}
    
                            const secondWordStyles = {
                                fontSize: 18,
                                color: wordColor,
                                fontFamily: 'PlusJakartaSans', // Apply Plus Jakarta Sans font
                                marginHorizontal: 3,
                                marginVertical: 2,
                            };
    
                            return (
                                <Text key={`word2-${index}`} style={secondWordStyles}>
                                    {word}
                                    {index < secondText.split(' ').length - 1 ? ' ' : ''}
                                </Text>
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };
    
    
    

    // Navigation button for scrolling to next
    const scrollToNext = () => {
        if (activeIndex < items.length - 1) {
            const nextIndex = activeIndex + 1;
            // Explicitly set activeIndex here too
            setActiveIndex(nextIndex);

            if (flatlistRef.current) {
                flatlistRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        } else {
            navigation.navigate('Signup');
        }
    };

    // Skip button handler to navigate directly to login
    const handleSkip = () => {
        navigation.navigate('Signup');
    };

    React.useEffect(() => {
        // Fixed image loading by ensuring correct path is used
        try {
            const DATA: FlightItem[] = [
                { id: 0, image: require('../assets/images/car1.png'), text: 'The best car in your hands with TripZip', secondText: 'Discover the convenience of finding your perfect ride with our TripZip App' },
                { id: 1, image: require('../assets/images/car2.png'), text: 'The perfect ride is just a tap away!', secondText: 'Your journey begins with TripZip. Find your ideal ride effortlessly.' },
                { id: 2, image: require('../assets/images/car3.png'), text: 'Your ride, your way. Lets get started!', secondText: 'Enter your destination, sit back, and let us take care of the rest.' },
            ];
            setItems(DATA);
        } catch (error) {
            console.error("Error loading images:", error);
            // Fallback if images can't be loaded
            const DATA: FlightItem[] = [
                { id: 0, image: null, text: 'The best car in your hands with TripZip', secondText: 'Discover the convenience of finding your perfect ride with our TripZip App' },
                { id: 1, image: null, text: 'The perfect ride is just a tap away!', secondText: 'Your journey begins with TripZip. Find your ideal ride effortlessly.' },
                { id: 2, image: null, text: 'Your ride, your way. Lets get started!', secondText: 'Enter your destination, sit back, and let us take care of the rest.' },
            ];
            setItems(DATA);
        }
    }, []);

    // Determine button text based on activeIndex
    const getButtonText = () => {
        return activeIndex >= 2 ? "Get Started" : "Next";
    };

    // Determine button style based on activeIndex
    const getButtonStyle = () => {
        return activeIndex >= 2 ? styles.getStartedButton : styles.nextButton;
    };

    return (
        <View style={styles.container}>
            {/* Skip button at the top right */}
            <View style={styles.skipButtonContainer}>
                <TouchableOpacity
                    onPress={handleSkip}
                    style={styles.skipButton}
                    accessibilityLabel="Skip onboarding"
                    accessibilityRole="button"
                >
                    <Text style={styles.skipButtonText}>Skip</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <AnimatedFlatList
                    data={items}
                    ref={flatlistRef}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true, listener: handleScroll }
                    )}
                    onScrollToIndexFailed={(info) => {
                        const wait = new Promise(resolve => setTimeout(resolve, 500));
                        wait.then(() => {
                            if (flatlistRef.current) {
                                flatlistRef.current.scrollToIndex({ index: info.index, animated: true });
                            }
                        });
                    }}
                    scrollEventThrottle={16}
                />

                {/* Styled text where each word has custom styling */}
                <View style={styles.textContainer}>
                    {items.length > 0 && activeIndex < items.length && (
                        renderStyledText(
                            items[activeIndex].text,
                            items[activeIndex].secondText,
                            items[activeIndex].id
                        )
                    )}
                </View>
            </View>

            {/* Bar indicators below the text with consistent spacing */}
            <View style={styles.indicatorContainer}>
                {renderBarIndicators()}
            </View>

            {/* Bottom button with dynamic text */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={scrollToNext}
                    style={[styles.button, getButtonStyle()]}
                    accessibilityLabel={getButtonText()}
                    accessibilityRole="button"
                >
                    <Text style={styles.buttonText}>{getButtonText()}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#FFB300'
    },
    skipButtonContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    skipButton: {
    },
    skipButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 60, // Add space for the skip button
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 20, // Consistent spacing
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20, // Consistent spacing
        paddingHorizontal: 20
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
        marginTop: 20, // Consistent spacing
    },
    button: {
        padding: 12,
        borderRadius: 30,
        width: '90%',
        alignItems: 'center'
    },
    nextButton: {
        backgroundColor: 'black',
    },
    getStartedButton: {
        backgroundColor: 'black',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold'
    }
});

export default Home;