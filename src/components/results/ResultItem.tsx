import React, { PureComponent } from 'react';
import {TouchableHighlight, StyleSheet, Image, Text, View } from 'react-native'
import { SearchResult } from '../../reducers/search'

interface ResultItemProps {
    result: SearchResult;
    onButtonPress: () => void;
    index: number;
}

interface ResultItemState {
    focused: boolean;
  }
  

class ResultItem extends PureComponent<ResultItemProps, ResultItemState> {

  state: ResultItemState = {
      focused: false
  }

  onFocus = (): void => {
    this.setState({
      focused: true,
    });
  };

  onBlur = (): void => {
    this.setState({
      focused: false,
    });
  };

  onPress = (): void => {
    this.props.onButtonPress();
  }

  render () {
    return (
            <TouchableHighlight 
                style={styles.button} 
                focusable={true} 
                onPress={this.onPress}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                key={this.props.index}
            >
                <View style={[styles.view, this.state.focused == true ? { backgroundColor: '#8AB0AF'}: null]} >
                    <Image source={{ uri: this.props.result.urls.thumb}} style={styles.image} />
                    <View style={styles.textView}>
                        <Text style={styles.text} >{this.props.result.description}</Text>
                    </View>
                </View>
                
            </TouchableHighlight>
        );
    }
  }

export default ResultItem ;

const styles = StyleSheet.create({
    button: {
        flex:0.25, 
        margin: 5
    },
    view: {
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#8AB0AF',
        borderWidth: 2,
        borderRadius: 5,
        padding: 2

      },
    textView: {
        alignSelf: 'center',
        height: 25
      },
    text: {
        textAlign: 'center',
        flexShrink: 1,
        fontSize: 10
    },
    image: {
        height: 100, 
        width: 100,
        resizeMode: 'cover',
        margin: 1
      },
  });