import React, { PureComponent } from 'react';
import {FlatList, StyleSheet} from 'react-native'
import {connect} from 'react-redux';
import ResultItem from './ResultItem';
import { FocusManager, FocusZone } from "@youi/react-native-youi";
import { SearchState, SearchResult } from '../../reducers/search'
import { NavigationFocusInjectedProps, withNavigationFocus } from 'react-navigation'
import { MainStore } from '../../store/store'

interface ResultScreenProps extends NavigationFocusInjectedProps {
    description: string;
    url: string;
    search: SearchState;
}

class ResultsScreen extends PureComponent<ResultScreenProps> {
    private focusZoneRef = React.createRef();
    private initialFocusRef = React.createRef();
    private listRef = React.createRef();
    private dataSource: SearchResult[] = this.props.search.currentResults;
    private num : number = 0;
    
    onButtonPress = (): void => {
        this.props.navigation.navigate("VideoPlayback");
    }

    screenFocusChanged = (focused: boolean): void => {
        FocusManager.setFocusRoot(this.focusZoneRef.current, focused);
        if (focused) {
            FocusManager.focus(this.focusZoneRef.current);
        }
    }

    componentDidMount(): void { 
        setTimeout((): void => {
            this.focusZoneRef.current.setInitialFocus(this.initialFocusRef.current);
            this.screenFocusChanged(true);
        }, 0);
    }

    componentWillUnmount(): void {
        this.screenFocusChanged(false);
    }

    componentDidUpdate(prevProps: ResultScreenProps): void {
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
                <FlatList 
                    data={this.dataSource}
                    keyExtractor={({index}) => index}
                    ref={this.listRef}
                    renderItem={({item, index}) => (
                        <ResultItem 
                            key={index}
                            ref={index === 0 && this.initialFocusRef}
                            result={item}  
                            onButtonPress={this.onButtonPress}
                        />
                    )}
                    numColumns={4}
                />
            </FocusZone>
        );
    }
  }


export default withNavigationFocus(connect(
    (state: MainStore) => ({search: state.search})
)(ResultsScreen));

const styles = StyleSheet.create({
    mainview: {
      flex: 1,
      backgroundColor: "#4e5166"
    },
    messageText: {
        textAlign: 'center',
        fontSize: 10,
        color: '#E3191A'
      },
  });