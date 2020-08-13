
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native'
import {  FocusManager, VideoRef, FocusZone, Composition, DeviceInfo } from "@youi/react-native-youi";
import { NavigationFocusInjectedProps, withNavigationFocus } from 'react-navigation';
import PlayerControls from './PlayerControls'
import keyInput, {KEYINPUTEVENTS} from '../../utils/keyInputEvents';

interface VideoPlaybackProps extends NavigationFocusInjectedProps{
}

interface VideoPlaybackState {
  isReady: boolean;
  isBuffering: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isDrawerShowing: boolean;
}

class VideoPlayback extends PureComponent<VideoPlaybackProps, VideoPlaybackState> { 
  video?: VideoRef;  
  private focusZoneRef = React.createRef();
  private hideTimeout: number = 0;

  private sourceInfo = DeviceInfo.getSystemName() === "android" ? 
  {
    uri: "http://amssamples.streaming.mediaservices.windows.net/683f7e47-bd83-4427-b0a3-26a6c4547782/BigBuckBunny.ism/manifest(format=mpd-time-csf)",
    type: "DASH"
  }
  : {
    uri: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
    type: "HLS"
  };

  state = {
    isReady: false,
    isBuffering: false,
    isPlaying: false,
    currentTime: 0,
    duration: 1,
    isDrawerShowing: false
  };

  setPlayPaused = (pause: boolean): void => {
    if (this.state.isReady) {
      if (pause) {
        this.video?.pause();
      }
      else {
        this.video?.play();
      }
    }
  };

  onBackButtonPressed = (): void => {
    this.props.navigation.goBack();
  }

  screenFocusChanged = (focused: boolean): void => {
    FocusManager.setFocusRoot(this.focusZoneRef.current, focused);
    if (focused) {
      FocusManager.focus(this.focusZoneRef.current);
    }
  }

  onKeyPressed = (): void => {
    if (!this.state.isDrawerShowing) {
      this.setState({ isDrawerShowing: true });
    }

    clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout((): void => { 
      this.setState({ isDrawerShowing: false });
   }, 7000);
  }

  componentDidMount(): void { 
    setTimeout((): void => {
      this.screenFocusChanged(true);
  }, 0);
    keyInput.addEventListener(
      KEYINPUTEVENTS.KEY_INPUT,
      this.onKeyPressed
    );
  }

  componentWillUnmount(): void {
    this.screenFocusChanged(false)
    keyInput.removeEventListeners();
  }

  componentDidUpdate(prevProps: VideoPlaybackProps): void {
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
        <Composition source="Player_VideoRef" style={styles.player} >
          <VideoRef 
            style={styles.player}
            name="Video-Surface-View"
            ref={(ref: VideoRef): void => {
              this.video = ref;
            }}
            source={this.sourceInfo}
            muted={false}
            onReady={(): void => {
              setTimeout((): void => {
                this.setState({ isReady: true });
                this.video && this.video.play();
              }, 500);
            }}
            onBufferingStarted={(): void => {
              this.setState({ isBuffering: true });
            }}
            onBufferingEnded={(): void => {
              this.setState({ isBuffering: false });
            }}
            onErrorOccurred={(): void => {
            }}
            onPlaybackComplete={(): void => {
              this.setState({ isReady: false, isPlaying: false });
              this.video?.seek(0);
              this.video?.play();
            }}
            onPaused={(): void => {
              this.setState({ isPlaying: false })
            }}
            onPlaying={(): void => {
              this.setState({ isPlaying: true })
            }}
            onCurrentTimeUpdated={(currentTime: number): void => {
              this.setState({ currentTime: currentTime })
            }}
            onDurationChanged={(duration: number): void => {
              this.setState({ duration: duration })
            }}
            onFinalized={(): void => {
              return;
            }}
          />
        </Composition>      
        <PlayerControls 
          onPlayPause={this.setPlayPaused}
          isPlaying={this.state.isPlaying}
          isShowing={this.state.isDrawerShowing}
          duration={this.state.duration}
          currentTime={this.state.currentTime}
          onBackPressed={this.onBackButtonPressed}
          style={styles.controls} />
      </FocusZone>
    );
    }
  }

  const styles = StyleSheet.create({
    mainview: {
      flex: 1,
      backgroundColor: "#000000"
    },
    player: {
      position: 'absolute'
    },
    controls: {
      position: 'absolute'
    }
  });


export default withNavigationFocus(VideoPlayback);
