import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem, Icon } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";
import SwipeableFlatlist from "../components/SwipeableFlatlist";

export default class NotificationScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotification: [],
    };
    this.requestRef = null;
  }
  getNotifications = () => {
    this.requestRef = db
      .collection("all_notifications")
      .where("notification_status", "==", "unread")
      .where("targeted_user_id", "==", this.state.userId)
      .onSnapshot((snapshot) => {
        var allNotification = [];
        snapshot.docs.map((doc) => {
          var notification = doc.data();
          notification["doc_id"] = doc.id;
          allNotification.push(notification);
        });
        this.setState({
          allNotification: allNotification,
        });
      });
  };

  componentDidMount() {
    this.getNotifications();
  }

  componentWillUnmount() {
    this.notificationRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => (
    <ListItem key={i} bottomDivider>
      <Icon name="book" type="font-awesome" color="#696969" />
      <ListItem.Content>
        <ListItem.Title>{item.item_name}</ListItem.Title>
        <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
          <MyHeader
            title={"Notifications"}
            navigation={this.props.navigation}
          />
        </View>
        <View style={{ flex: 0.9 }}>
          {this.state.allNotification.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 25 }}>No new Notifications!</Text>
            </View>
          ) : (
            <SwipeableFlatlist allNotifications={this.state.allNotification} />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
