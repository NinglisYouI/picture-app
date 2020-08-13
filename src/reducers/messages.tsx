enum ActionTypes {
    MESSAGE_SHOW = "MESSAGE_SHOW"
}

export interface ShowMessage {
    type: ActionTypes.MESSAGE_SHOW;
    payload: string;
  }

type Actions = ShowMessage;

export const showMessage = (msg: string) => ({type: ActionTypes.MESSAGE_SHOW, payload: msg})

export default function(state: string='', action: Actions) {
    switch (action.type)
    {
        case ActionTypes.MESSAGE_SHOW:
            return action.payload;
        default:
        return state;
    }
}