
import React, { PureComponent } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableHighlight} from 'react-native'
import {searchImages, setSearchTerm, SearchState} from '../../reducers/search'
import { MainStore } from '../../store/store'
import {connect} from 'react-redux';
import { FocusManager, FocusZone } from "@youi/react-native-youi";
import { NavigationFocusInjectedProps, withNavigationFocus } from 'react-navigation';

interface SearchScreenProps extends NavigationFocusInjectedProps  {
  description: string;
  url: string;
  search: SearchState;
  searchImages: (searchTerm: string, callback: () => void) => void;
  setSearchTerm: (searchTerm: string) => void;
  message: string;
}

interface SearchScreenState {
  focusedItem: string;
}

const TEXTBOX_FOCUS = "textbox";
const BUTTON_FOCUS = "button";
const NORMAL_COLOR = '#8AB0AF';
const FOCUS_COLOR = '#BAE0DF';

class SearchScreen extends PureComponent<SearchScreenProps, SearchScreenState> {
  private textInputRef = React.createRef();    
  private focusZoneRef = React.createRef();

  state: SearchScreenState = {
    focusedItem: ''
  };

  onTextboxFocused = (): void => {
    this.setState({focusedItem: TEXTBOX_FOCUS})
  };

  onButtonFocused = (): void => {
    this.setState({focusedItem: BUTTON_FOCUS})
  };

  onBlur = (): void => {
    this.setState({focusedItem: ''})
  };

  searchFinished = (): void => 
  {
    this.props.navigation.navigate('ResultsScreen')
  };

  searchPressed = (): void =>  {
      this.props.searchImages(this.props.search.searchTerm, this.searchFinished);
  }

  screenFocusChanged = (focused: boolean): void => {
    FocusManager.setFocusRoot(this.focusZoneRef.current, focused);
    if (focused) {
      FocusManager.focus(this.textInputRef.current);
    }
  }

  componentDidMount(): void { 
    this.screenFocusChanged(true);
  }

  componentWillUnmount(): void {
    console.log("Search Screen componentWillUnmount")
    this.screenFocusChanged(false)
  }

  componentDidUpdate(prevProps: SearchScreenProps): void {
    if (prevProps.isFocused !== this.props.isFocused) {
        this.screenFocusChanged(this.props.isFocused)
    }
  }

  render() {
    return (
      <FocusZone 
        ref={this.focusZoneRef} 
        style={styles.mainview} 
        entryMode={'last'}
      >
        <View style={styles.inputView}>
          <View 
            style={[ styles.inputSubView, 
              {borderColor: this.state.focusedItem === TEXTBOX_FOCUS ? FOCUS_COLOR :NORMAL_COLOR }]}
          >
          <TextInput 
              style={styles.inputBox}
              placeholder="Search"
              onChangeText={(text: string) => {
                this.props.setSearchTerm(text)
              }} 
              onSubmitEditing={this.searchPressed}
              value={this.props.search.searchTerm}
              onFocus={this.onTextboxFocused}
              OnBlur={this.onBlur}
              ref={this.textInputRef}
          />
          </View>
        </View>
        <View style={styles.searchButtonView}>
          <TouchableHighlight 
            style={[styles.searchButton, {backgroundColor: this.state.focusedItem === BUTTON_FOCUS ? FOCUS_COLOR :NORMAL_COLOR}]}
            onPress={this.searchPressed}  
            onFocus={this.onButtonFocused}
            OnBlur={this.onBlur}
          >
            <Text style={styles.searchButtonText} >Search</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.messageView} >
          <Text style={styles.messageText} >{this.props.message}</Text>
        </View>
      </FocusZone>
    );
    }
  }


export default withNavigationFocus(connect(
    (state: MainStore) => ({message: state.message,
      search: state.search}),
    {searchImages, setSearchTerm}
)(SearchScreen));

const styles = StyleSheet.create({
    mainview: {
      flex: 1,
      backgroundColor: "#4e5166"
    },
    inputView: {
      marginTop: 100,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputSubView: {
      borderWidth: 3,
      borderRadius: 20,
      borderStyle: 'solid',
      overflow: 'hidden'
    },
    inputBox: {
      height: 40,
      width: 300,
      fontSize: 16,
  },
    searchButtonView: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
      marginBottom: 5
    },
    searchButton: {
      backgroundColor: '#8AB0AF',
      borderRadius: 2,
      padding: 1,
      paddingHorizontal: 20
    },
    searchButtonText: {
      color: '#0E7CF9'
    },
    messageText: {
      textAlign: 'center',
      fontSize: 10,
      color: '#E3191A'
    },
    messageView: {
      marginTop: 10,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });