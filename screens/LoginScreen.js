import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import db from "../config";
import firebase from "firebase";

export default class LoginScreen extends Component {
  constructor() {
    super();
    this.state = {
      isModalVisible: "false",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailId: "",
      password: "",
      confirmPassword: "",
      currencyCode: "",
    };
  }

  userLogin = (emailId, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate("Home");
        //return Alert.alert("Logged in Successfully");
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return Alert.alert(errorMessage);
      });
  };

  userSignUp = (emailId, password, confirmPassword) => {
    if (password !== confirmPassword) {
      return Alert.alert("Password does not match!\nCheck your Password.");
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(emailId, password)
        .then(() => {
          db.collection("users").add({
            First_Name: this.state.firstName,
            Last_Name: this.state.lastName,
            Phone_Number: this.state.phoneNumber,
            Email_ID: this.state.emailId,
            Address: this.state.address,
            IsItemRequestActive: false,
            Currency_Code: this.state.currencyCode,
          });
          return Alert.alert("User Added Successfully", "", [
            {
              text: "OK",
              onPress: () => this.setState({ isModalVisible: false }),
            },
          ]);
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return Alert.alert(errorMessage);
        });
    }
  };

  showModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: "100%" }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text style={styles.modalTitle}>Register Yourself!</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                placeholderTextColor="black"
                onChangeText={(text) => {
                  this.setState({
                    firstName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Last Name"}
                placeholderTextColor="black"
                onChangeText={(text) => {
                  this.setState({
                    lastName: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Phone Number"}
                placeholderTextColor="black"
                maxLength={10}
                keyboardType={"numeric"}
                onChangeText={(text) => {
                  this.setState({
                    phoneNumber: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Address"}
                placeholderTextColor="black"
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Email ID"}
                placeholderTextColor="black"
                keyboardType={"email-address"}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Choose a Password"}
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Confirm Password"}
                placeholderTextColor="black"
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text,
                  });
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Country Curreny Code"}
                placeholderTextColor="black"
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    currencyCode: text,
                  });
                }}
              />
              <View>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() =>
                    this.userSignUp(
                      this.state.emailId,
                      this.state.password,
                      this.state.confirmPassword
                    )
                  }
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ isModalVisible: false })}
                >
                  <Text
                    style={{
                      color: "mediumorchid",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          {this.showModal()}
          <Text style={styles.title}>Barter System App</Text>
          <Image
            source={require("../assets/image.png")}
            style={{ width: 300, height: 260 }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TextInput
            style={styles.loginBox}
            placeholder="Email ID"
            placeholderTextColor="black"
            keyboardType="email-address"
            onChangeText={(text) => {
              this.setState({
                emailId: text,
              });
            }}
          />
          <TextInput
            style={styles.loginBox}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="black"
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 50 }]}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password);
            }}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.setState({ isModalVisible: true });
            }}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6ccff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 50,
    marginBottom: 80,
  },
  KeyboardAvoidingView: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 28,
    color: "mediumorchid",
    margin: 50,
    fontWeight: "bold",
  },
  formTextInput: {
    width: "75%",
    height: 40,
    alignSelf: "center",
    borderColor: "mediumorchid",
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
  },
  registerButton: {
    width: 180,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 30,
  },
  registerButtonText: {
    color: "mediumorchid",
    fontSize: 17,
    fontWeight: "bold",
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "lavender",
  },
  profileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  title: {
    fontSize: 40,
    fontWeight: "300",
    paddingBottom: 20,
    color: "mediumorchid",
  },
  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: "violet",
    fontSize: 20,
    margin: 10,
  },
  button: {
    width: 300,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    backgroundColor: "violet",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10.32,
    elevation: 16,
  },
  buttonText: {
    color: "black",
    fontWeight: "200",
    fontSize: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
  },
});
