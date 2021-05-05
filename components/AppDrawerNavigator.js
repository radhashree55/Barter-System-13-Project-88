import React from "react";
import { createDrawerNavigator } from "react-navigation-drawer";
import { AppTabNavigator } from "./AppTabNavigator";
import CustomSideBarMenu from "./CustomSideBarMenu";
import SettingsScreen from "../screens/SettingsScreen";
import MyBartersScreen from "../screens/MyBartersScreen";
import NotificationScreen from "../screens/NotificationScreen";

export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
    },
    Settings: {
      screen: SettingsScreen,
    },
    MyBarters: {
      screen: MyBartersScreen,
    },
    Notifications: {
      screen: NotificationScreen,
    },
  },
  {
    contentComponent: CustomSideBarMenu,
  },
  {
    initialRouteName: "Home",
  }
);
