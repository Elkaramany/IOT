import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Animated,
  PanResponder
} from "react-native";
import React, { useEffect } from "react";
import useState from 'react-usestateref';
import * as ImagePicker from "expo-image-picker";
import i18n from "i18n-js";
import { useSelector, useDispatch } from 'react-redux'
import * as sagaTypes from '../../Redux/Sagas/types'
import Sensors from '../common/Sensors'
import { GlobalStyles, SENSOR_SCREEN_HEIGHT, SENSOR_SCREEN_WIDTH, SENSOR_HEIGHT, SENSOR_W, SENSOR_WIDTH } from "../common/Constants";

export default function Index({ route }) {
  const { id, name } = route.params
  const [image, setImage] = React.useState(null);
  const dispatch = useDispatch()
  const list = useSelector(state => state.BluetoothReducer.list)
  const [deleteSensorActive, setDeleteSensorActive] = React.useState(false)
  const [initialRender, setInitialRender] = React.useState(true)

  const [sensor1, setSensor1, sensor1Ref] = useState([]);
  const [sensor2, setSensor2, sensor2Ref] = useState([]);
  const [sensor3, setSensor3, sensor3Ref] = useState([]);

  useEffect(() => {
    //Check Redux if this BLE ID has been saved before and set the sensors images to it if it has
    //values set by the previous visit
    list.map((item) => {
      if (item.id == id) {
        if (item.image) setImage(item.image)
        if (item.sensor1) setSensor1(item.sensor1)
        if (item.sensor2) setSensor2(item.sensor2)
        if (item.sensor3) setSensor3(item.sensor3)
      }
    })
    setInitialRender(false)
  }, [])

  const mainPanResponder = (number, panVal, index) => {
    const pan = new Animated.ValueXY({ x: panVal.x, y: panVal.y });
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [
          null,
          { dx: pan.x, dy: pan.y },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        setNewSensorArr(number, pan, index)
      }
    })
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const createPanResponderSensor = (xVal, yVal, index, number) => {
    const pan = new Animated.ValueXY({ x: xVal, y: yVal });

    return { number, index, pan }
  }

  const setNewSensorArr = (number, pan, index) => {
    //Save the new coordinated after the sensor drag is released to the sensor array and then redux
    if (number == 1) {
      setSensor1(getNewArrayValue(pan, index, sensor1Ref.current))
    } else if (number == 2) {
      setSensor2(getNewArrayValue(pan, index, sensor2Ref.current))
    }
    if (number == 3) {
      setSensor3(getNewArrayValue(pan, index, sensor3Ref.current))
    }
  }

  const getNewArrayValue = (panVal, i, sensorArr) => {
    let arr = [...sensorArr]
    let xVal = Number(JSON.stringify(panVal.x))
    let yVal = Number(JSON.stringify(panVal.y))

    //Check to see if the new coordinates doesn't go off the screen
    console.log(i)
    if (xVal < 0 - SENSOR_WIDTH * i) xVal = 0 - SENSOR_WIDTH * i
    else if (xVal > (SENSOR_SCREEN_WIDTH - SENSOR_WIDTH - 6) - SENSOR_WIDTH * i) xVal = (SENSOR_SCREEN_WIDTH - SENSOR_WIDTH - 6) - SENSOR_WIDTH * i

    if (yVal < -7) yVal = -7
    else if (yVal > SENSOR_SCREEN_HEIGHT - SENSOR_HEIGHT + 1) yVal = SENSOR_SCREEN_HEIGHT - SENSOR_HEIGHT + 1

    let finalPan = new Animated.ValueXY({ x: xVal, y: yVal });
    arr[i].animatedVal.pan = finalPan
    return arr
  }

  const getNewReduxArr = () => {
    //Format the array values and image into one array to be saved into redux
    let arr = [...list]
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        arr[i].image = image
        arr[i].sensor1 = sensor1
        arr[i].sensor2 = sensor2
        arr[i].sensor3 = sensor3
        break;
      }
    }

    return arr
  }

  useEffect(() => {
    if (!initialRender) {
      //Save data to redux
      dispatch({ type: sagaTypes.saveBleDataSaga, payload: { newList: getNewReduxArr(), oldList: getNewReduxArr() } })
    }
  }, [sensor1, sensor2, sensor3, image])

  const clearAllSensors = () => {
    setSensor1([])
    setSensor2([])
    setSensor3([])
  }

  const deleteSelectedSensor = (number, index) => {
    let arr = []
    if (number == 1) {
      arr = [...sensor1]
      arr.splice(index, 1)
      setSensor1(arr)
    } else if (number == 2) {
      arr = [...sensor2]
      arr.splice(index, 1)
      setSensor2(arr)
    } else if (number == 3) {
      arr = [...sensor3]
      arr.splice(index, 1)
      setSensor3(arr)
    }
  }

  return (

    <View style={GlobalStyles.container}>
      <ScrollView>
        <View style={{ backgroundColor: "#b4b4b4", justifyContent: "center", alignItems: 'center' }}>
          <Text style={GlobalStyles.title}>
            {i18n.t("commissioning.Commissioning")}
          </Text>
        </View>

        <View style={{ margin: 10 }}>
          <Text>{name || "No name"}</Text>
          <Text>ID: {id}</Text>

        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>

          <TouchableOpacity
            style={[GlobalStyles.button, { alignSelf: 'center' }]}
            onPress={() => {
              setDeleteSensorActive(deleteSensorActive => !deleteSensorActive)
            }}
          >
            <Text style={GlobalStyles.buttonText}>{deleteSensorActive ? "Clear Sensor Active" : "Clear sensor"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[GlobalStyles.button, { alignSelf: 'center' }]}
            onPress={() => {
              clearAllSensors()
            }}
          >
            <Text style={GlobalStyles.buttonText}>Clear All sensors</Text>
          </TouchableOpacity>

        </View>

        <View style={{ flexDirection: 'row' }}>

          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginRight: 20, marginLeft: 5 }}>
            <TouchableOpacity
              onPress={() => {
                setSensor1(sensor1 => [...sensor1, {
                  animatedVal: createPanResponderSensor(10 + (10 * sensor1.length), SENSOR_HEIGHT * 1.2, sensor1.length, 1)
                }])
              }}
            >
              <Image
                style={GlobalStyles.tinyLogo}
                source={require('../../../assets/Sensor1.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSensor2(sensor2 => [...sensor2, {
                  animatedVal: createPanResponderSensor(10 + (10 * sensor2.length), SENSOR_HEIGHT * 3.8, sensor2.length, 2)
                }])
              }}
            >
              <Image
                style={GlobalStyles.tinyLogo}
                source={require('../../../assets/Sensor2.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSensor3(sensor3 => [...sensor3, {
                  animatedVal: createPanResponderSensor(10 + (10 * sensor3.length), SENSOR_HEIGHT * 6.4, sensor3.length, 3)
                }])
              }}
            >
              <Image
                style={GlobalStyles.tinyLogo}
                source={require('../../../assets/Sensor3.png')}
              />
            </TouchableOpacity>
          </View>

          <View style={GlobalStyles.main}>
            {image && (
              <Image source={{ uri: image }}
                style={{ width: '100%', height: '100%' }} />
            )}
            <Sensors movable={true} deleteSensorActive={deleteSensorActive} deleteSensor={(index) => deleteSelectedSensor(1, index)}
              sensor={sensor1} image={require("../../../assets/Sensor1.png")}
              mainPanResponder={(number, pan, index) => mainPanResponder(number, pan, index)} />
            <Sensors movable={true} deleteSensorActive={deleteSensorActive} deleteSensor={(index) => deleteSelectedSensor(2, index)}
              sensor={sensor2} image={require("../../../assets/Sensor2.png")}
              mainPanResponder={(number, pan, index) => mainPanResponder(number, pan, index)} />
            <Sensors movable={true} deleteSensorActive={deleteSensorActive} deleteSensor={(index) => deleteSelectedSensor(3, index)}
              sensor={sensor3} image={require("../../../assets/Sensor3.png")}
              mainPanResponder={(number, pan, index) => mainPanResponder(number, pan, index)} />
          </View>
        </View>


        <View style={styles.footer}>
          <TouchableOpacity style={GlobalStyles.button} onPress={pickImage}>
            <Text style={GlobalStyles.buttonText}>
              {i18n.t("commissioning.Change_bg")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    marginBottom: 15
  },
});
