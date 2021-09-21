import React, {
  useState,
  useEffect,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  NativeModules,
  NativeEventEmitter,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  Alert,
  FlatList,
  LogBox,
} from 'react-native';
import i18n from "i18n-js";

import Device from "./Device";
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { GlobalStyles } from '../common/Constants';
import BleManager from 'react-native-ble-manager';

import { useSelector, useDispatch } from 'react-redux';
import * as sagaTypes from '../../Redux/Sagas/types';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const Index = ({ navigation }) => {
  //Check the documentation of the react-native-bluetooth-state-manager library
  //before reading the code here:
  const [isScanning, setIsScanning] = useState(false);
  const peripherals = new Map();
  const dispatch = useDispatch()
  const list = useSelector(state => state.BluetoothReducer.list || state.BluetoothReducer.INITIAL_STATE.list)
  const [scannedList, setScannedList] = useState([])
  const [connectedDevice, setConnectedDevice] = useState(null)
  const [isConnecting, setIsConnecting] = useState(null)
  const serviceUUID = []

  const startScan = async () => {
    if (!isScanning) {
      if (connectedDevice) disconnectFromDevice(connectedDevice)
      setScannedList([])
      BluetoothStateManager.getState().then((bluetoothState) => {
        if (bluetoothState !== 'PoweredOn') {
          Alert.alert("Please turn on your Bluetooth")
          return;
        }
      }).catch((e) => {
        Alert.alert("Error getting bluetooth status")
      })
      BleManager.scan([], 5, true).then((results) => {
        console.log('Scanning...');
        setIsScanning(true);
      }).catch(err => {
        console.log(err);
      })

    } else {
      handleStopScan()
    }
  }

  const handleStopScan = () => {
    console.log('Scan is stopped');
    setIsScanning(false);
  }

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setScannedList(Array.from(peripherals.values()))
      dispatch({ type: sagaTypes.saveBleDataSaga, payload: { newList: Array.from(peripherals.values()), oldList: list } })
    }
    console.log('Disconnected from ' + data.peripheral);
  }

  const handleUpdateValueForCharacteristic = (data) => {
    console.log('Received data from ' + data.peripheral + ' characteristic ' + data.characteristic, data.value);
  }

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log('No connected peripherals')
        return;
      }
      matchStoredValuesToScanned()
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setScannedList(Array.from(peripherals.values()))
        dispatch({ type: sagaTypes.saveBleDataSaga, payload: { newList: Array.from(peripherals.values()), oldList: list } })
      }
    }).catch((e) => {
      Alert.alert(e.toString())
    })
  }

  const handleDiscoverPeripheral = (peripheral) => {
    peripherals.set(peripheral.id, peripheral);
    setScannedList(Array.from(peripherals.values()))
    //Pas the newly discovered BLE devices to redux along with the all old list to append
    //any new discovered devices
    dispatch({ type: sagaTypes.saveBleDataSaga, payload: { newList: Array.from(peripherals.values()), oldList: list } })
  }

  useEffect(() => {
    BleManager.start({ showAlert: false });

    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral);
    bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic);

    if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          }).catch((e) => console.error(e))
        }
      });
    }

    return () => {
      if (connectedDevice) disconnectFromDevice(connectedDevice)
    }

  }, []);

  useEffect(() => {
    console.log("Scanned List:")
    console.log(JSON.stringify(scannedList))
    matchStoredValuesToScanned()

  }, [isScanning])

  const matchStoredValuesToScanned = () => {
    // to check if the scanned ble device has been scanned before and if it has a different name
    setTimeout(() => {
      let obj = {}

      for (let i = 0; i < scannedList.length; i++) {
        if (!obj[scannedList[i].id]) {
          obj[scannedList[i].id] = i
        }
      }

      for (let i = 0; i < list.length; i++) {
        if (list[i].id in obj) {
          let newArr = [...scannedList]
          newArr[obj[list[i].id]].name = list[i].name
          setScannedList(newArr)
        }
      }
    }, 1000)
  }

  const connectToDevice = (device) => {
    if (isScanning) {
      Alert.alert("Please wait until the scan is completed")
      return;
    }
    if (connectedDevice) disconnectFromDevice(connectedDevice)
    setIsConnecting(`${i18n.t("devices.Connecting_to")} ${device.name || device.id}`)
    BleManager.connect(device.id.toString()).then(() => {
      Alert.alert(`Connected to ${device.id}`)
      setConnectedDevice(device)
      retrieveConnected(true)
      setIsConnecting(null)
    }).catch((e) => {
      console.error(e)
      setIsConnecting(null)
    })
  }

  const disconnectFromDevice = (device) => {
    if (!connectedDevice) {
      Alert.alert("No device is connected")
      return;
    }
    setIsConnecting(`${i18n.t("devices.Disconnecting_from")} ${device.name || device.id}`)
    BleManager.disconnect(device.id).then(() => {
      Alert.alert(`Disconnected from ${device.id}`)
      setConnectedDevice(null)
      retrieveConnected()
      setIsConnecting(null)
    }).catch((e) => {
      console.error(e)
      setIsConnecting(null)
    })
  }

  const renderItem = ({ item }) => {
    if (item.advertising.isConnectable == true && item.id != connectedDevice?.id) {
      return (
        <Device
          device={item}
          key={item.id}
          selectDevice={(device) => connectToDevice(device)}
          deSelectDevice={(device) => { }}
          showExtraTools={false}
          isConnecting={isConnecting}
        />
      )
    }
  }

  const renderConnectedItem = () => {
    if (connectedDevice) {
      return (
        <Device
          device={connectedDevice}
          key={connectedDevice.id}
          selectDevice={(device) => { }}
          deSelectDevice={(device) => disconnectFromDevice(device)}
          showExtraTools={true}
          navigation={navigation}
        />
      )
    }
  }

  return (
    <ScrollView style={GlobalStyles.container}>

      <View style={styles.headerContainer}>
        <Text style={GlobalStyles.title}>{i18n.t("devices.Devices")}</Text>
        {isScanning && (
          <Text style={[styles.devicesTitle, { color: 'black' }]}>{i18n.t('devices.Currently_Scanning')}</Text>
        )}

        {isConnecting && (
          <Text style={[styles.devicesTitle, { color: 'black' }]}>{isConnecting}</Text>
        )}
        <TouchableOpacity onPress={() => startScan()}>
          {!isScanning && <Image
            style={styles.settings}
            source={require("../../img/settings.png")}
          />}
        </TouchableOpacity>
      </View>

      <View style={styles.redHeaderContainer}>
        <Text style={styles.devicesTitle}>
          {i18n.t("devices.Connected_devices")}
        </Text>
      </View>

      {renderConnectedItem()}

      <View style={[styles.redHeaderContainer, { marginTop: 20 }]}>
        <Text style={styles.devicesTitle}>
          {i18n.t("devices.Visible_devices")}
        </Text>
      </View>

      <FlatList
        contentContainerStyle={{ marginBottom: 5 }}
        data={scannedList}
        renderItem={renderItem}
        keyExtractor={device => device.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#b4b4b4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settings: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    color: "white",
    margin: 20,
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  redHeaderContainer: {
    backgroundColor: "red",
  },
  devicesTitle: {
    color: "white",
    fontWeight: "bold",
    margin: 15,
    marginLeft: 20,
    fontSize: 15,
  },
});

export default Index