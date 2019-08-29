import React, { useState, useEffect } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';

interface Props {
    onPress: () => void;
    visible: boolean;
}

const ActionButton = (props: Props) => {
    const { onPress, visible } = props;
    const [fadeAnim] = useState(new Animated.Value(1));
    const { container, circle, text } = styles;

    useEffect(() => {
        const toValue = visible ? 1 : 0;
        Animated.timing(
            fadeAnim,
            {
                toValue: toValue,
                duration: 300
            }
        ).start();
    }, [visible])

    return (
        <TouchableOpacity style={container} onPress={onPress}>
            <Animated.View style={[circle, { opacity: fadeAnim }]}>
                <Text style={text}>+</Text>
            </Animated.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 60
    },
    circle: {
        flex: 1,
        borderRadius: 50,
        backgroundColor: "red",
        justifyContent: "center"
    },
    text: {
        color: "white",
        textAlign: "center",
        fontSize: 24
    }
})

export default ActionButton;