import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import NameModal from "./NameModal";
import { useDispatch, useSelector } from "react-redux";
import { GlobalStyles } from "../common/Constants";
import * as sagaTypes from '../../Redux/Sagas/types'

export default function Device({ device, navigation, selectDevice, deSelectDevice, showExtraTools, isConnecting }) {

  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch()
  const list = useSelector(state => state.BluetoothReducer.list)

  const editName = () => {
    setModalVisible(true);
  };

  const changeDeviceName = (newName) => {
    device.name = newName;
    dispatch({ type: sagaTypes.changeBleName, payload: { list, name: newName, id: device.id } })
  }

  return (
    <>
      <NameModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        name={device.name}
        setName={(newName) => changeDeviceName(newName)}
      />

      <TouchableOpacity style={styles.container} onPress={() => isConnecting == null ? selectDevice(device) : {}}>
        <View style={styles.leftBlock}>
          <Text style={styles.name}>{device.name || 'No name'}</Text>
          <Text>ID: {device.id}</Text>
          <Text>RSSI: {device.rssi}</Text>
        </View>


        <TouchableOpacity
          onPress={isConnecting == null ? editName : {}}
        >
          <Image style={styles.iconStyle}
            source={require('../../img/EditName.png')}
            resizeMode={'contain'}
          />
        </TouchableOpacity>

        {showExtraTools ? (
          <View style={styles.rightBlock}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Monitor", {
                  name: device.name,
                  id: device.id,
                })
              }
            >
              <Image style={styles.iconStyle}
                source={require('../../img/Monitor.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Commissioning", {
                  name: device.name,
                  id: device.id,
                })
              }
            >
              <Image style={styles.iconStyle}
                source={require('../../img/Commissioning.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Diagnosis")}
            >
              <Image style={styles.iconStyle}
                source={require('../../img/Diagnosis.png')}
                resizeMode={'contain'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deSelectDevice(device)}
            >
              <Image
                style={styles.iconStyle}
                source={require("../../img/trash.png")}
              />
            </TouchableOpacity>
          </View>
        ) : null}
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#d9d9d9",
    padding: 20,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rightBlock: {
    flexDirection: "row",
  },
  name: {
    fontWeight: "bold",
  },
  iconStyle: {
    height: 60,
    width: 60,
    marginHorizontal: 5,
  },
});
