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
      specialEditedVisible: false,    // the special edition one 
    }

    this._showActionSheet = this._showActionSheet.bind(this)
    this._renderListRow = this._renderListRow.bind(this)
    this._handleCancel = this._handleCancel.bind(this)
  }

  _showActionSheet(title) {
    let sheetType = title.toLowerCase()
    if (sheetType === 'default') {
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
    } else {

    }
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
          <View style={{ marginHorizontal: 15, }}>
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

  _handleCancel() {

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
          <Button title="Default" handleClick={this._showActionSheet} />
          <Button title="Decorated" handleClick={this._showActionSheet} />
        </View>
        <ActionListSheet
          useDefaultTitle={true}
          renderListRow={this._renderListRow}
          ref='actionListSheet'
          onCancel={this._handleCancel}
          isVisible={this.state.actionListSheetVisible} />
        <ActionListSheet
          useDefaultTitle={false}
          renderListRow={this._renderListRow}
          titleRender={this._titleRender}
          ref='actionListSheet'
          onCancel={this._handleCancel}
          isVisible={this.state.actionListSheetVisible} />
      </View>
    )
  }
}

const Button = ({title, handleClick}) => (
  <TouchableOpacity onPress={() => handleClick(title)} style={{ marginLeft: 10, }}>
    <View style={styles.buttonContainer}>
      <Text style={styles.buttonText}>{title || 'POP UP'}</Text>
    </View>
  </TouchableOpacity>
)

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
