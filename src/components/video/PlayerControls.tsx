import React, { PureComponent } from 'react';
import { Composition, TimelineRef, ViewRef, ButtonRef, TextRef } from "@youi/react-native-youi";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: (pause: boolean) => void;
  onBackPressed: () => void;
  isShowing: boolean;
  duration: number;
  currentTime: number;
}

class PlayerControls extends PureComponent<PlayerControlsProps> { 
  inTimeline?: TimelineRef;
  outTimeline?: TimelineRef;
  inTimelineBack?: TimelineRef;
  outTimelineBack?: TimelineRef;
  inTimelinePlayPause?: TimelineRef;
  outTimelinePlayPause?: TimelineRef;
  toggleToPauseTimeline?: TimelineRef;
  toggleToPlayTimeline?: TimelineRef;
  scrubberTimeline?: TimelineRef;

  playInTimelines = (): void => {
    console.log("Playing in timelines")
     this.inTimeline.play();
     this.inTimelineBack.play();
    this.inTimelinePlayPause.play();
  }

  playOutTimelines = (): void => {
    this.outTimeline.play();
    this.outTimelineBack.play();
    this.outTimelinePlayPause.play();
  }

  onBackPressed = (): void => {
    if (this.props.onBackPressed) {
      this.props.onBackPressed();
    }
  }
  onPlayPausedPressed = (): void => {
    this.props.onPlayPause(this.props.isPlaying);
  }

  padTime = (time: number): string => {
    return ("00"+time).slice(-2);
  }

  timeToReadable = (time: number): string => {
    const inSeconds = Math.floor(time/1000);
    const secondsInMinute = 60;
    const secondsInHour = secondsInMinute*60;
    let secondsLeft = inSeconds;
    let hours = 0;
    let minutes = 0;
    if (secondsLeft >= secondsInHour)
    {
      hours = Math.floor(secondsLeft / secondsInHour);
      secondsLeft -= hours * secondsInHour;
    } 

    if (secondsLeft >= secondsInMinute)
    {
      minutes = Math.floor(secondsLeft / secondsInMinute);
      secondsLeft -= minutes * secondsInMinute;
    } 

    return `${this.padTime(hours)}:${this.padTime(minutes)}:${this.padTime(secondsLeft)}`;
  }

  componentDidMount(): void {
    if (this.props.isPlaying) {
      this.toggleToPauseTimeline.play();
    }
  }

  componentDidUpdate(prevProps: PlayerControlsProps): void {
    const {isShowing, isPlaying, currentTime, duration} = this.props;
    if (prevProps.isShowing != isShowing) {
      if (isShowing) {
        this.playInTimelines();
      }
      else {
        this.playOutTimelines();
      }
    }

    if (prevProps.isPlaying != isPlaying) {
      if (isPlaying) {
        this.toggleToPauseTimeline.play();
      }
      else {
        this.toggleToPlayTimeline.play();
      }
    }

    if (this.scrubberTimeline && (currentTime != prevProps.currentTime || duration != prevProps.duration)) {
      this.scrubberTimeline.seek(duration !== 0 ? currentTime / duration : 0);
      this.scrubberTimeline.pause();
    }
  }

  render() {
    return (
        <Composition source="Player_Playback-Controls" >
          <TimelineRef name="In" 
            onCompositionDidLoad={(ref: TimelineRef) => {
              this.inTimeline = ref;
              if (this.props.isShowing) {
                this.inTimeline.play();
              }   
            }}/>
          <TimelineRef name="Out" onCompositionDidLoad={(ref: TimelineRef) => (this.outTimeline = ref)} />
        <ViewRef name="Btn-Back-Container">
            <ButtonRef name="Btn-Back" onPress={this.onBackPressed} />
            <TimelineRef name="In" onCompositionDidLoad={(ref: TimelineRef) => {
              this.inTimelineBack = ref;
              if (this.props.isShowing) {
                this.inTimelineBack.play();
              }  
            }} />
            <TimelineRef name="Out" onCompositionDidLoad={(ref: TimelineRef) => (this.outTimelineBack = ref)} />
          </ViewRef>
          <ViewRef name="Player-Scrubber">
            <ViewRef name="Player-ScrollBar">
              <TimelineRef 
                name="ScrollStart" 
                onCompositionDidLoad={(ref: TimelineRef) => {
                  this.scrubberTimeline = ref;
                  this.scrubberTimeline.seek(this.props.duration !== 0 ? this.props.currentTime / this.props.duration: 0);
                  this.scrubberTimeline.pause();
                  }} />
            </ViewRef>
          </ViewRef>
          <TextRef name="Placeholder-Time" text={this.timeToReadable(this.props.currentTime)} />
          <ViewRef name="PlayPause-Container">
            <ButtonRef name="Btn-PlayPause" onPress={this.onPlayPausedPressed} >
              <TimelineRef name="Toggle-On" onCompositionDidLoad={(ref: TimelineRef) => (this.toggleToPauseTimeline = ref)} />
              <TimelineRef name="Toggle-Off" onCompositionDidLoad={(ref: TimelineRef) => (this.toggleToPlayTimeline = ref)} />
            </ButtonRef>
            <TimelineRef name="In" onCompositionDidLoad={(ref: TimelineRef) => {
              this.inTimelinePlayPause = ref;
              if (this.props.isShowing) {
                this.inTimelinePlayPause.play();
              }  
            }} />
            <TimelineRef name="Out" onCompositionDidLoad={(ref: TimelineRef) => (this.outTimelinePlayPause = ref)} />
          </ViewRef> 
        </Composition>
    );
    }
  }

export default PlayerControls;
