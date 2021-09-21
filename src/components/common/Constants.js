import { Dimensions, StyleSheet } from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const SENSOR_SCREEN_WIDTH = SCREEN_WIDTH * 1.39
const SENSOR_SCREEN_HEIGHT = SCREEN_HEIGHT * 0.8

const SENSOR_WIDTH = SCREEN_WIDTH * 0.2
const SENSOR_HEIGHT = SCREEN_HEIGHT * 0.09

const GlobalStyles = StyleSheet.create({
    title: {
        color: "white",
        margin: 20,
        marginLeft: 10,
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'left'
    },
    button: {
        backgroundColor: "tomato",
        width: 170,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 14
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    main: {
        borderWidth: 3,
        borderColor: "#325490",
        width: SENSOR_SCREEN_WIDTH,
        height: SENSOR_SCREEN_HEIGHT,
        marginTop: 20,
        marginBottom: 10,
    },
    tinyLogo: {
        height: SENSOR_HEIGHT,
        width: SENSOR_WIDTH,
        resizeMode: 'contain',
    },
})

export { GlobalStyles, SENSOR_SCREEN_HEIGHT, SENSOR_SCREEN_WIDTH, SENSOR_WIDTH, SENSOR_HEIGHT }