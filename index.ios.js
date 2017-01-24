/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from 'react-native';

import ActionListSheet from './js/ActionListSheet'

export default class Application extends Component {
  constructor(props) {
    super(props)

    this.state = {
      actionListSheetVisible: false,
    }

    this._showActionSheet = this._showActionSheet.bind(this)
    this._renderListRow = this._renderListRow.bind(this)
    this._handleCancel = this._handleCancel.bind(this)
  }

  _showActionSheet() {
    this.actionListSheet = this.refs.actionListSheet

    this.actionListSheet.showWithOptions()
  }

  _renderListRow() {

  }

  _handleCancel() {

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
        <TouchableWithoutFeedback onPress={this._showActionSheet}>
          <Text>Pop up</Text>
        </TouchableWithoutFeedback>
        <ActionListSheet
          useDefaultTitle={false}
          renderListRow={this._renderListRow}
          ref='actionTitleSheet'
          onCancel={this._handleCancel}
          isVisible={this.state.actionListSheetVisible} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ActionListSheet', () => Application);
