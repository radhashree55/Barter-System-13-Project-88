import React, { Component } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Card, Icon, ListItem } from "react-native-elements";
import MyHeader from "../components/MyHeader.js";
import firebase from "firebase";
import db from "../config.js";

export default class MyBartersScreen extends Component {
  constructor() {
    super();
    this.state = {
      exchangerId: firebase.auth().currentUser.email,
      exchangerName: "",
      allBarters: [],
    };
    this.requestRef = null;
  }

  static navigationOptions = { header: null };

  getExchangerDetails = (exchangerId) => {
    db.collection("users")
      .where("Email_ID", "==", exchangerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            exchangerName: doc.data().First_Name + " " + doc.data().Last_Name,
          });
        });
      });
  };

  getAllBarters = () => {
    this.requestRef = db
      .collection("all_barters")
      .where("exchanger_id", "==", this.state.exchangerId)
      .onSnapshot((snapshot) => {
        var allBarters = [];
        snapshot.docs.map((doc) => {
          var barter = doc.data();
          barter["doc_id"] = doc.id;
          allBarters.push(barter);
        });
        this.setState({
          allBarters: allBarters,
        });
      });
  };

  sendBook = (itemDetails) => {
    if (itemDetails.request_status === "Item Sent") {
      var requestStatus = "exchanger Interested";
      db.collection("all_barters").doc(itemDetails.doc_id).update({
        request_status: "exchanger Interested",
      });
      this.sendNotification(itemDetails, requestStatus);
    } else {
      var requestStatus = "Item Sent";
      db.collection("all_barters").doc(itemDetails.doc_id).update({
        request_status: "Item Sent",
      });
      this.sendNotification(itemDetails, requestStatus);
    }
  };

  sendNotification = (itemDetails, requestStatus) => {
    var requestId = itemDetails.request_id;
    var exchangerId = itemDetails.exchanger_id;
    db.collection("all_notifications")
      .where("request_id", "==", requestId)
      .where("exchanger_id", "==", exchangerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var message = "";
          if (requestStatus === "Item Sent") {
            message = this.state.exchangerName + " sent you the Item";
          } else {
            message =
              this.state.exchangerName +
              " has shown interest in Exchanging the Item with you!";
          }
          db.collection("all_notifications").doc(doc.id).update({
            message: message,
            notification_status: "unread",
            date: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
      });
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <TouchableOpacity>
      <ListItem key={i} bottomDivider>
        <Icon name="article" type="material" color="black" size={35} />

        <ListItem.Content>
          <ListItem.Title style={{ fontSize: 20, fontWeight: "bold" }}>
            {item.item_name}
          </ListItem.Title>
          <ListItem.Subtitle>
            {"Requested By : " +
              item.requested_by +
              "\nStatus : " +
              item.request_status}
          </ListItem.Subtitle>
          <Text style={styles.button}>Exchange Items</Text>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  componentDidMount() {
    this.getAllBarters();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyHeader navigation={this.props.navigation} title="My Barters" />
        <View style={{ flex: 1 }}>
          {this.state.allBarters.length === 0 ? (
            <View style={styles.subtitle}>
              <Text style={{ fontSize: 20 }}>List of All Barters</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.allBarters}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lavender",
    color: "mediumorchid",
    shadowColor: "#000",
    textAlign: "center",
    fontWeight: "bold",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
  subtitle: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
