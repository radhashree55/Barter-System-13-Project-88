import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config.js";

export default class ReceiverDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      receiverId: this.props.navigation.getParam("details")["user_name"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      itemName: this.props.navigation.getParam("details")["item_name"],
      itemDescription: this.props.navigation.getParam("details")[
        "item_description"
      ],
      itemValue: this.props.navigation.getParam("details")["item_value"],
      receiverName: "",
      receiverPhoneNumber: "",
      receiverAddress: "",
      receiverRequestDocId: "",
    };
  }

  getReceiverDetails() {
    db.collection("users")
      .where("Email_ID", "==", this.state.receiverId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            receiverName: doc.data().First_Name,
            receiverPhoneNumber: doc.data().Phone_Number,
            receiverAddress: doc.data().Address,
          });
        });
      });

    db.collection("items_for_exchange")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({ receiverRequestDocId: doc.id });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection("users")
      .where("Email_ID", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().First_Name + " " + doc.data().Last_Name,
          });
        });
      });
  };

  updateItemStatus = () => {
    db.collection("all_barters").add({
      item_name: this.state.itemName,
      request_id: this.state.requestId,
      requested_by: this.state.receiverName,
      exchanger_id: this.state.userId,
      request_status: "Exchanger Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in Donating the book";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.receiverId,
      exchanger_id: this.state.userId,
      request_id: this.state.requestId,
      item_name: this.state.itemName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getReceiverDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="black"
                sixe={30}
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Exchange Item",
              style: {
                color: "mediumorchid",
                fontSize: 30,
                fontWeight: "bold",
              },
            }}
            backgroundColor="lavender"
          />
        </View>
        <View style={{ flex: 0.3, marginTop: 20 }}>
          <Card title={"Item Information"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Name : {this.state.itemName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Value : {this.state.itemValue}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Description : {this.state.itemDescription}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={{ flex: 0.3, marginTop: 20 }}>
          <Card title={"Receiver Information"} titleStyle={{ fontSize: 20 }}>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Username: {this.state.receiverName}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Phone Number: {this.state.receiverPhoneNumber}
              </Text>
            </Card>
            <Card>
              <Text style={{ fontWeight: "bold" }}>
                Address: {this.state.receiverAddress}
              </Text>
            </Card>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          {this.state.receiverId !== this.state.userId ? (
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.updateItemStatus();
                this.addNotification();
                this.props.navigation.navigate("MyBarters");
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "mediumorchid",
                  fontWeight: "bold",
                }}
              >
                I wish to Exchange!
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "65%",
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
  },
});
