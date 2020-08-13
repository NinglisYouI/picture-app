import { NativeEventEmitter, NativeModules } from "react-native";

const KeyInputModule = NativeModules.KeyInputModule;

const eventName = "KEY_INPUT"

export enum KEYINPUTEVENTS {
    KEY_INPUT = "KEY_INPUT"
}

export interface KeyInputEvent {
  eventName: "KEY_INPUT";
}

type KeyInputEventCallback = (event: KeyInputEvent) => void;

class KeyInput extends NativeEventEmitter {

  private registeredEvents: {
    type: KEYINPUTEVENTS;
    handler: KeyInputEventCallback;
  }[] = [];

  constructor() {
    super(KeyInputModule);
  }

  addEventListener(type: KEYINPUTEVENTS, handler: KeyInputEventCallback): void {
    this.addListener(type, handler);
    this.registeredEvents.push({
      type,
      handler
    });
  }
  removeEventListeners(): void  {
    this.registeredEvents.forEach(({ type, handler }): void  => {
      this.removeListener(type, handler);
    });
    this.registeredEvents = [];
  }
}

export default new KeyInput();
