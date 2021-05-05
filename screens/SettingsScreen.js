import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import MyHeader from "../components/MyHeader";
import db from "../config";
import firebase from "firebase";

export default class SettingsScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailId: "",
      docId: "",
    };
  }

  getUserDetails = () => {
    var email = firebase.auth().currentUser.email;
    db.collection("users")
      .where("Email_ID", "==", email)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var data = doc.data();
          this.setState({
            emailId: data.Email_ID,
            firstName: data.First_Name,
            lastName: data.Last_Name,
            address: data.Address,
            phoneNumber: data.Phone_Number,
            docId: doc.id,
          });
        });
      });
  };

  updateUserDetails = () => {
    db.collection("users").doc(this.state.docId).update({
      First_Name: this.state.firstName,
      Last_Name: this.state.lastName,
      Address: this.state.address,
      Phone_Number: this.state.phoneNumber,
    });

    Alert.alert("Profile Updated Successfully");
  };

  componentDidMount() {
    this.getUserDetails();
  }

  render() {
    return (
      <View style={styles.container}>
        <MyHeader title="Settings" navigation={this.props.navigation} />
        <Text style={{ marginTop: 10, fontSize: 17, fontWeight: "bold" }}>
          UPDATE USER DETAILS
        </Text>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.formTextInput}
            placeholder={"First Name"}
            onChangeText={(text) => {
              this.setState({
                firstName: text,
              });
            }}
            value={this.state.firstName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Last Name"}
            onChangeText={(text) => {
              this.setState({
                lastName: text,
              });
            }}
            value={this.state.lastName}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Phone Number"}
            maxLength={10}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text,
              });
            }}
            value={this.state.phoneNumber}
          />
          <TextInput
            style={styles.formTextInput}
            placeholder={"Address"}
            multiline={true}
            onChangeText={(text) => {
              this.setState({
                address: text,
              });
            }}
            value={this.state.address}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.updateUserDetails();
            }}
          >
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  formTextInput: {
    width: "75%",
    height: 40,
    alignSelf: "center",
    borderColor: "mediumorchid",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "lavender",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 30,
  },
  buttonText: {
    color: "mediumorchid",
    fontSize: 24,
    fontWeight: "bold",
  },
});
