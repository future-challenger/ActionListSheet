/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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
    this.setState({ actionListSheetVisible: true, })
    this.actionListSheet = this.refs.actionListSheet

    let options = [
      {
        title: 'title 1', subTitle: 'sub title 1'
      }, {
        title: 'title 2', subTitle: 'sub title 2'
      }
    ]
    this.actionListSheet.showWithOptions({
      options,
      title: 'Demo',
    }, (buttonIndex) => {
      console.log('=====> selected a index', buttonIndex)
    }, () => {
      this.setState({ actionListSheetVisible: false, })
    })
  }

  /**
   * render rows with this method
   */
  _renderListRow(data, sectionID, rowID, context, callback) {
    const ActionRow = ({data, sectionID, rowID, context, callback}) => {
      return (<TouchableWithoutFeedback onPress={() => {
        if (callback && typeof callback === 'function') {
          callback(rowID)
        }
      }}>
        <View style={{ flexDirection: 'row', height: 60, flex: 1, alignItems: 'center', justifyContent: 'flex-start', }}>
          <View>
            <Text style={{ fontSize: 15, color: '#333' }}>{`分${data.terms}期`}</Text>
            <Text style={{ fontSize: 13, color: '#999999', marginTop: 9, }}>
              {data.interest_rate === 0 ? '免服务费' : `每期服务费${data.interest_rate}%`}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>)
    }
    return () => {
      return <ActionRow data={data} sectionID={sectionID} rowID={rowID} context={context} callback={callback} />
    }
  }

  _titleRender() {

  }

  _titleRender() {

  }

  _handleCancel() {

  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._showActionSheet}>
          <View style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Pop up</Text>
          </View>
        </TouchableOpacity>
        <ActionListSheet
          useDefaultTitle={false}
          renderListRow={this._renderListRow}
          ref='actionListSheet'
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
  buttonContainer: {
    borderWidth: 1,
    borderColor: 'blue',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: 'blue',
  },
});

AppRegistry.registerComponent('ActionListSheet', () => Application);
