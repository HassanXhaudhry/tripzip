import React, { useRef, useState } from 'react';
import { Animated, Dimensions, FlatList, FlatListProps, Image, TouchableOpacity, View, Text, NativeSyntheticEvent, NativeScrollEvent, ListRenderItem, StyleSheet, Button } from "react-native";
import { Link, useRouter } from 'expo-router';

interface FlightItem {
    id: number;
    image: any;
    text: string;
    secondText?: string;
}
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as React.ForwardRefExoticComponent<
    FlatListProps<FlightItem> & React.RefAttributes<FlatList<FlightItem>>
>;
const Main: React.FC = () => {
    const router = useRouter();
    const flatlistRef = useRef<FlatList<FlightItem>>(null);
    const screenWidth = Dimensions.get("window").width;
    const screenHeight = Dimensions.get("window").height;
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [items, setItems] = useState<FlightItem[]>([]);
    const scrollX = useRef(new Animated.Value(0)).current;
    const buttonTextOpacity = useRef(new Animated.Value(1)).current;
    const [buttonText, setButtonText] = useState("Next");
    
    const mainTextOpacity = useRef(new Animated.Value(1)).current;
    const secondTextOpacity = useRef(new Animated.Value(1)).current;

    const slideClicked = (item: FlightItem): void => {
        console.log(`Slide ${item.id} clicked`);
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
        const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
        if (newIndex !== activeIndex && newIndex >= 0 && newIndex < items.length) {
            updateIndexWithAnimations(newIndex);
        }
    };

    const updateIndexWithAnimations = (newIndex: number) => {
        Animated.parallel([
            Animated.timing(buttonTextOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(mainTextOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            }),
            Animated.timing(secondTextOpacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true
            })
        ]).start(() => {
            setActiveIndex(newIndex);
            setButtonText(newIndex >= 2 ? "Get Started" : "Next");
  
            Animated.parallel([
                Animated.timing(buttonTextOpacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(mainTextOpacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                }),
                Animated.timing(secondTextOpacity, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();
        });
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

    const renderStyledText = (text: string, secondText?: string, itemId?: number) => {
        const words = text.split(' ');

        return (
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <Animated.View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', opacity: mainTextOpacity }}>
                    {words.map((word, index) => {
                        let wordColor = '#000000';
                        let fontStyle: 'normal' | 'italic' = 'normal';
                        const cleanWord = word.replace(/[^\w]/g, '');
                        if (itemId === 0 && cleanWord.toLowerCase() === 'tripzip') {
                            wordColor = '#FFFFFF';
                            fontStyle = 'italic';
                        }

                        const wordStyles = {
                        };

                        return (
                            <Text
                                key={`word-${index}`}
                                style={[
                                    wordStyles, 
                                    {
                                        fontSize: 26,
                                        color: wordColor,
                                        fontStyle: fontStyle,
                                        marginHorizontal: 3,
                                        marginVertical: 2,
                                        fontWeight: 'bold',
                                    }
                                ]}
                            >
                                {word}
                                {index < words.length - 1 ? ' ' : ''}
                            </Text>
                        );
                    })}
                </Animated.View>

                {secondText && (
                    <Animated.View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: 8, opacity: secondTextOpacity }}>
                        {secondText.split(' ').map((word, index) => {
                            let wordColor = '#000000';

                            if (itemId === 0 || itemId === 1) {
                                wordColor = '#FFFFFF';
                            } else if (itemId === 2) {
                                wordColor = '#858585';
                            }

                            const secondWordStyles = {
                                fontSize: 18,
                                color: wordColor,
                                fontFamily: 'PlusJakartaSans',
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
                    </Animated.View>
                )}
            </View>
        );
    };
    
    const scrollToNext = () => {
        if (activeIndex < items.length - 1) {
            const nextIndex = activeIndex + 1;
            
            updateIndexWithAnimations(nextIndex);

            if (flatlistRef.current) {
                flatlistRef.current.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        } else {
            router.push('/(auth)/Login');
        }
    };

    const handleSkip = () => {
        router.push('/(auth)/Login');
    };

    React.useEffect(() => {
        try {
            const DATA: FlightItem[] = [
                { id: 0, image: require('../assets/images/car1.png'), text: 'The best car in your hands with TripZip', secondText: 'Discover the convenience of finding your perfect ride with our TripZip App' },
                { id: 1, image: require('../assets/images/car2.png'), text: 'The perfect ride is just a tap away!', secondText: 'Your journey begins with TripZip. Find your ideal ride effortlessly.' },
                { id: 2, image: require('../assets/images/car3.png'), text: 'Your ride, your way. Lets get started!', secondText: 'Enter your destination, sit back, and let us take care of the rest.' },
            ];
            setItems(DATA);
        } catch (error) {
            console.error("Error loading images:", error);
            const DATA: FlightItem[] = [
                { id: 0, image: null, text: 'The best car in your hands with TripZip', secondText: 'Discover the convenience of finding your perfect ride with our TripZip App' },
                { id: 1, image: null, text: 'The perfect ride is just a tap away!', secondText: 'Your journey begins with TripZip. Find your ideal ride effortlessly.' },
                { id: 2, image: null, text: 'Your ride, your way. Lets get started!', secondText: 'Enter your destination, sit back, and let us take care of the rest.' },
            ];
            setItems(DATA);
        }
    }, []);

    const getButtonStyle = () => {
        return activeIndex >= 2 ? styles.getStartedButton : styles.nextButton;
    };

    return (
        <View style={styles.container}>
            <View style={styles.skipButtonContainer}>
                <TouchableOpacity
                    onPress={handleSkip}
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
                        const wait = new Promise(resolve => setTimeout(resolve, 3000));
                        wait.then(() => {
                            if (flatlistRef.current) {
                                flatlistRef.current.scrollToIndex({ index: info.index, animated: true });
                            }
                        });
                    }}
                    scrollEventThrottle={16}
                />

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

            <View style={styles.indicatorContainer}>
                {renderBarIndicators()}
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={scrollToNext}
                    style={[styles.button, getButtonStyle()]}
                    accessibilityLabel={buttonText}
                    accessibilityRole="button"
                >
                    <Animated.Text
                        style={[
                            styles.buttonText,
                            { opacity: buttonTextOpacity }
                        ]}
                    >
                        {buttonText}
                    </Animated.Text>
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
        backgroundColor: '#FFB300',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    skipButtonContainer: {
        position: 'absolute',
        top: 50,
        right: 50,
        zIndex: 10,
    },
    skipButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 60,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: 'center',
        marginVertical: 20,
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: 20
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 40,
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 30,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 200,
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
        fontWeight: 'bold',
        textAlign: 'center',
    }
});

export default Main;