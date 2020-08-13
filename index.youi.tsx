/**
 * Basic You.i RN app
 */
import React, { Component } from "react";
import { AppRegistry, StyleSheet, View, Text } from "react-native";
import { Provider } from "react-redux";
import App from "./src/App";
import store from "./src/store/store";

export default class YiReactApp extends Component  {
  render() {
    return (
      <View style={styles.mainContainer}>
        <Provider store={store} >
          <App />
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#e6e7e7",
    flex: 1
  }
});

AppRegistry.registerComponent("YiReactApp", () => YiReactApp);
