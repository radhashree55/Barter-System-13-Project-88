import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class HomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requests: [],
    };
    this.requestRef = null;
  }

  getRequests = () => {
    this.requestRef = db
      .collection("items_for_exchange")
      .onSnapshot((snapshot) => {
        var requests = snapshot.docs.map((document) => document.data());
        this.setState({
          requests: requests,
        });
      });
  };

  componentDidMount() {
    this.getRequests();
  }

  componentWillUnmount() {
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate("ReceiverDetails", { details: item });
        }}
      >
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{item.item_name}</ListItem.Title>
            <ListItem.Subtitle>{item.item_description}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.view}>
        <MyHeader title="Items Available" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requests.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20, color: "mediumorchid" }}>
                List Of All Items Available
              </Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requests}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
