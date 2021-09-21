import React from 'react'
import { View, Animated, Image, StyleSheet, Pressable } from 'react-native'
import { GlobalStyles } from '../common/Constants'

export default function Index({ movable, sensor, image,
    deleteSensorActive, deleteSensor, mainPanResponder }) {

    const getPanResponderStyle = (e) => {
        const animatedVal = e.animatedVal
        if (deleteSensorActive || !movable) return null
        else {
            const panResponder = mainPanResponder(animatedVal.number, animatedVal.pan, animatedVal.index)
            return panResponder.panHandlers
        }
    }

    return (
        <View style={{
            flexDirection: 'row',
            position: 'absolute'
        }}>
            {sensor.map((e, i) => {
                return (
                    <Animated.View
                        key={i}
                        style={{
                            transform: [{ translateX: e.animatedVal.pan.x }, { translateY: e.animatedVal.pan.y }]
                        }}
                        {...getPanResponderStyle(e)}
                    >
                        <Pressable onPress={() => deleteSensorActive ? deleteSensor(i) : {}}>
                            <Image
                                style={GlobalStyles.tinyLogo}
                                source={image}
                            />
                        </Pressable>
                    </Animated.View>
                );
            })}
        </View>
    )
}
