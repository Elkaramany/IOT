import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import i18n from "i18n-js";
import { useSelector } from 'react-redux'
import Sensors from '../common/Sensors'
import { GlobalStyles } from "../common/Constants";

export default function Index({ route }) {
  const { id, name } = route.params
  const [image, setImage] = useState(null);
  const [sensor1, setSensor1] = useState([]);
  const [sensor2, setSensor2] = useState([]);
  const [sensor3, setSensor3] = useState([]);

  const list = useSelector(state => state.BluetoothReducer.list)

  useEffect(async () => {
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
  }, [])



  return (

    <View style={GlobalStyles.container}>
      <ScrollView>
        <View style={{ backgroundColor: "#b4b4b4", justifyContent: "center", alignItems: 'center' }}>
          <Text style={GlobalStyles.title}>
            {i18n.t("monitor.Monitor")}
          </Text>
        </View>

        <View style={{ margin: 10 }}>
          <Text>{name || "No name"}</Text>
          <Text>ID: {id}</Text>

        </View>

        <View style={{ flexDirection: 'row' }}>

          <View style={{ flexDirection: 'column', justifyContent: 'space-evenly', marginRight: 20 }}>
            <TouchableOpacity
              onPress={() => {
                {}
              }}
            >
              <Image
                style={GlobalStyles.tinyLogo}
                source={require('../../../assets/Sensor1.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                {}
              }}
            >
              <Image
                style={GlobalStyles.tinyLogo}
                source={require('../../../assets/Sensor2.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                {}
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
            <Sensors movable={false} sensor={sensor1} image={require("../../../assets/Sensor1.png")} />
            <Sensors movable={false} sensor={sensor2} image={require("../../../assets/Sensor2.png")} />
            <Sensors movable={false} sensor={sensor3} image={require("../../../assets/Sensor3.png")} />
          </View>
        </View>
      </ScrollView>
    </View >
  );
}