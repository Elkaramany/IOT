import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import i18n from 'i18n-js';

export default function NameModal(props) {
  const [text, onChangeText] = useState(props.name);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.modalVisible}
      onRequestClose={() => {
        props.setModalVisible(!props.modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{i18n.t('modal.Change_name')}</Text>
          <TextInput
            value={text}
            style={styles.input}
            onChangeText={onChangeText}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.buttonHide]}
              onPress={() => props.setModalVisible(!props.modalVisible)}
            >
              <Text style={styles.textStyle}>{i18n.t('modal.Hide')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonChange]}
              onPress={() => {
                props.setName(text);
                props.setModalVisible(!props.modalVisible);
              }}
            >
              <Text style={styles.textStyle}>{i18n.t('modal.Validate')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,

  },
  modalView: {
    height: '80%',
    width: '60%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 30,
    margin: 5,
    elevation: 2,
    borderRadius: 15,
  },
  buttonChange: {
    backgroundColor: "#2196F3",
  },
  buttonHide: {
    backgroundColor: "#d9d9d9",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },
  input: {
    height: 40,
    width: 150,
    marginBottom: 15,
    borderWidth: 1,
    padding: 5,
    fontSize: 18
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
