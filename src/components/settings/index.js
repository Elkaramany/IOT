import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import i18n from 'i18n-js';

import LangageModal from "./LangageModal";
import DateModal from "./DateModal";

export default function Index() {
  const [langageModalVisible, setLangageModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  function showVersion() {
    Alert.alert(i18n.t('settings.App_version'), Constants.manifest.version, [{ text: "OK" }], {
      cancelable: false,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <LangageModal
        modalVisible={langageModalVisible}
        setModalVisible={setLangageModalVisible}
      />

      <DateModal
        modalVisible={dateModalVisible}
        setModalVisible={setDateModalVisible}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{i18n.t('settings.Settings')}</Text>
      </View>

      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLangageModalVisible(true)}
        >
          <Text style={styles.buttonText}>{i18n.t('settings.Language')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setDateModalVisible(true)}
        >
          <Text style={styles.buttonText}>{i18n.t('settings.Date_time')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => showVersion()}>
          <Text style={styles.buttonText}>{i18n.t('settings.App_version')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#b4b4b4",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "white",
    margin: 20,
    marginLeft: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  button: {
    margin: 10,
    width: 200,
    backgroundColor: "#b4b4b4",
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
