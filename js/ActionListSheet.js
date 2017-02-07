/*

 Created by Uncle Charlie, 2016/12/28

 @flow

 */

import React from 'react'
import {
  BackAndroid,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  Image,
  Animated,
  Easing,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Dimensions,
  ListView,
} from 'react-native'

var {height, width} = Dimensions.get('window')
const ScreenHeight = height
const ScreenWidth = width
//
const OPACITY_ANIMATION_TIME = 300;
const PIXEL = 1 / PixelRatio.get();
const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2
});

const MAIN_COLOR = 'green'

const ActionTitle = ({titleInfo, onCancel}) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 95, }}>
      <Image style={styles.titleCloseImage} />
      <View style={styles.titleInnerContainer}>
        <Text style={{ fontSize: 15 }}>{`【${titleInfo.class_hour}课时】${titleInfo.name}`}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15, marginTop: 12, justifyContent: 'space-between', }}>
          <Text style={{ fontSize: 15, color: '#ff6c45' }}>{`￥${titleInfo.fee}`}</Text>
          <View style={{ borderWidth: 1, borderRadius: 3, borderColor: '#ff6c45', justifyContent: 'center', alignItems: 'center', }}>
            <Text style={{ color: 'orange', textAlign: 'center', marginHorizontal: 5, fontSize: 13, }}>{`${titleInfo.mark}`}</Text>
          </View>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={() => {
        console.log('=================')
        onCancel()
      }}>
        <Image style={{ width: 15, height: 15, position: 'absolute', right: 17, top: 17, }} source={require('../images/close.png')} />
      </TouchableWithoutFeedback>
    </View>
  )
}

const DefaultActionTitle = ({title, onCancel}) => {
  return (
    <View style={{ height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>{title}</Text>
      <TouchableWithoutFeedback onPress={onCancel}>
        <Image
          style={{ width: 15, height: 15, position: 'absolute', right: 17, top: 17, }}
          source={require('../images/close.png')} />
      </TouchableWithoutFeedback>
    </View>
  )
}

class ActionListGroup extends React.Component {
  constructor(props) {
    super(props)

    this._renderListRow = this._renderListRow.bind(this)
    this._renderSeperator = this._renderSeperator.bind(this)
    this._pressRow = this._pressRow.bind(this)
  }

  render() {
    let {
      options,
      onSelect,
      title,
      desctructiveButtonIndex,
    } = this.props

    let color = '#444444'

    console.log(`=====>Action list sheet use title ${this.props.useDefaultTitle}`)
    return (
      <View style={styles.groupContainer}>
        {
          !this.props.useDefaultTitle
            ? <ActionTitle titleInfo={this.props.titleInfo} onCancel={this.props.onCancel} />
            : <DefaultActionTitle title={this.props.title} onCancel={this.props.onCancel} />
        }
        <View key={`separator-title`} style={{ height: 1, flex: 0, width: ScreenWidth, backgroundColor: '#CCCCCC' }} />
        <ListView
          scrollEnabled={true}
          dataSource={ds.cloneWithRows(options)}
          renderRow={this._renderListRow}
          renderSeparator={this._renderSeperator}
        />
        <View key={`separator-bottom`} style={{ flex: 0, height: 1, width: ScreenWidth, backgroundColor: 'white' }} />
        <TouchableOpacity activeOpacity={1} style={styles.sureButton} onPress={this.props.onSelect}>
          <Text style={styles.sureText}>{!this.props.sureText ? '确定' : this.props.sureText}</Text>
          {
            !this.props.subSureText || <Text style={{ fontSize: 11, color: '#999999', marginTop: 5, }}>
              {this.props.subSureText}
            </Text>
          }
        </TouchableOpacity>
      </View>
    )
  }

  _renderListRow(rowData, sectionID, rowID) {
    if (this.props.renderListRow) {
      let selectedRow = !this.props.selectedRow ? 0 : this.props.selectedRow
      console.log(`======> Action List Sheet SEL: ${selectedRow} ACTUAL: ${typeof rowID}`)
      let context = {
        selectedRow,
        selectedIndex: this.props.selectedIndex,
      }
      return this.props.renderListRow(rowData, sectionID, rowID,
        (rowID == context.selectedRow) ? context : { selectedRow: -1, selectedIndex: -1 }, this.props.onSelectRow)()
    }

    let color = '#333333'
    let textStyle = this.props.textStyle

    return (
      <TouchableOpacity onPress={() => {
        this._pressRow(rowID);
      }}>
        <View>
          <View style={styles.button}>
            <Text style={[styles.text, { color }, textStyle, { marginHorizontal: 17 }]}>
              {rowData}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  _renderSeperator(sectionID, rowID) {
    if (this.props.renderSeparator) {
      return this.props.renderSeparator(sectionID, rowID)
    }

    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{
          height: 1,
          backgroundColor: '#CCCCCC',
        }}
      />
    )
  }

  _pressRow(rowID) {
    this.props.onSelectRow(rowID)
  }
}

export default class ActionListSheet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: null,
      isVisible: false,
      isAnimating: false,
      onSelect: null,
      selectedRow: null,
      overlayOpacity: new Animated.Value(0),
      sheetOpacity: new Animated.Value(0),
      sheetPosition: new Animated.Value(0),
    }

    this._renderSheet = this._renderSheet.bind(this)
    this._onSelect = this._onSelect.bind(this)
    this.showWithOptions = this.showWithOptions.bind(this)
    this._selectCancelButton = this._selectCancelButton.bind(this)
    this._animateOut = this._animateOut.bind(this)
    this._onSelectRow = this._onSelectRow.bind(this)
  }

  _renderSheet() {
    if (!this.state.options) {
      return
    }

    return (
      <TouchableWithoutFeedback onPress={this._selectCancelButton}>
        <Animated.View
          needsOffscreenAlphaCompositing={this.state.isAnimating}
          style={[styles.sheetContainer, {
            opacity: this.state.sheetOpacity,
            transform: [{ scale: this.state.sheetOpacity.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.6, 1, 1] }) },
            {
              translateY: this.state.sheetPosition.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 0]
              })
            }],
          }]}>
          <View style={styles.sheet}>
            <ActionListGroup
              title={this.state.options.title}
              options={this.state.options.options}
              desctructiveButtonIndex={this.state.options.desctructiveButtonIndex}
              onSelect={this._onSelect}
              textStyle={this.state.options.textStyle}
              sureText={this.state.options.sureText}
              onCancel={this._selectCancelButton}
              onSelectRow={this._onSelectRow}
              renderListRow={this.props.renderListRow}
              sureText={this.state.options.sureText}
              subSureText={this.state.options.subSureText}
              selectedRow={this.state.selectedRow}
              useDefaultTitle={this.props.useDefaultTitle}
              titleInfo={this.state.options.titleInfo}
              selectedIndex={this.state.selectedIndex}
            />
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    )
  }

  /*
               onResponderTerminationRequest={(evt) => {
                console.log('=====>action list sheet, onResponderTerminationRequest')
                return false
              }}
   */

  render() {
    let {isVisible} = this.props

    if (isVisible) {
      return (
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          
            {/* {React.Children.only(this.props.children)} */}
            {/* <Animated.View style={[styles.overlay, {
            opacity: this.state.overlayOpacity,
          }]}/> */}
            {this._renderSheet()}
          
        </View>
      )
    }

    return null
  }

  showWithOptions(options, onSelect, onAnimateOut) {
    if (this.state.isVisible) {
      return
    }

    this.setState({
      options,
      onSelect,
      isVisible: true,
      isAnimating: true,
    })

    this.state.overlayOpacity.setValue(0)
    this.state.sheetOpacity.setValue(0)

    Animated.parallel([
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0.5,
        easing: Easing.in(Easing.linear),
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      }),
      Animated.timing(this.state.sheetOpacity, {
        toValue: 1,
        easing: Easing.in(Easing.linear),
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      }),
      Animated.timing(this.state.sheetPosition, {
        toValue: 1,
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      }),
    ]).start(result => {
      if (result.finished) {
        this.setState({
          isAnimating: false,
        })
      }
    })

    console.log('=====>action sheet showWithOptions', this.props)
    if (!onAnimateOut) {
      this._animateOutCallback = this.props.onCancel
    } else {
      this._animateOutCallback = onAnimateOut
    }

    BackAndroid.addEventListener('actionSheetHardwareBackPress', this._selectCancelButton)
  }

  _selectCancelButton() {
    console.log('=====> _selectCancelButton')
    if (!this.state.options) {
      return false
    }

    return this._animateOut()
  }

  _onSelectRow(rowId, index) {
    console.log(`=========>On Select Row ${rowId}`)
    this.setState({ selectedRow: rowId, selectedIndex: index })
  }

  _onSelect() {
    console.log('======>_onSelect')
    if (this.state.isAnimating) {
      return false
    }

    this.state.onSelect && this.state.onSelect(this.state.selectedRow)

    return this._animateOut()
  }

  _animateOut() {
    console.log('=====>_animateOut')
    if (this.state.isAnimating) {
      return false
    }

    BackAndroid.removeEventListener('actionSheetHardwareBackPress', this._selectCancelButton)

    this.setState({
      isAnimating: true
    })

    Animated.parallel([
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0,
        easing: Easing.in(Easing.linear),
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      }),
      Animated.timing(this.state.sheetOpacity, {
        toValue: 0,
        easing: Easing.in(Easing.linear),
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      }),
      Animated.timing(this.state.sheetPosition, {
        toValue: 0,
        duration: OPACITY_ANIMATION_TIME,
        useNativeDriver: this.props.useNativeDriver,
      })
    ]).start(result => {
      if (result.finished) {
        this.setState({
          isVisible: false,
          isAnimating: false,
        })
        if (typeof this._animateOutCallback === 'function') {
          this._animateOutCallback()
          this._animateOutCallback = null
        }
      }
    })

    return true
  }
}

let styles = StyleSheet.create({
  groupContainer: {
    backgroundColor: '#fefefe',
    borderRadius: 0,
    // borderColor: '#cbcbcb',
    // borderWidth: PIXEL,
    // overflow: 'hidden',
    marginHorizontal: 0,
    bottom: 0,
    height: ScreenHeight / 2,
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
  },
  rowSeparator: {
    backgroundColor: '#dddddd',
    height: 1,
    flex: 1,
  },
  button: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  text: {
    fontSize: 15,
    // fontWeight: '700',
    textAlignVertical: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  sureText: {
    fontSize: 18,
    color: '#333333', fontWeight: 'bold'
  },
  sureButton: {
    backgroundColor: MAIN_COLOR,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  titleCloseImage: {
    backgroundColor: 'red',
    marginLeft: 17,
    marginBottom: 15,
    borderRadius: 4,
    width: 100,
    height: 100,
    top: -20,
    position: 'absolute',
  },
  titleInnerContainer: {
    marginLeft: 130,
    marginBottom: 0,
    flex: 1,
    height: 80,
    justifyContent: 'flex-end',
    marginRight: 45
  },
})
