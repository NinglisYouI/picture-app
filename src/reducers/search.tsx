import { unsplashSearch } from '../lib/unsplashServices'
import { showMessage } from './messages'

enum ActionTypes {
    UPDATE_SEARCH_TERM = 'UPDATE_SEARCH_TERM',
    UPDATE_SEARCH_RESULTS = 'UPDATE_SEARCH_RESULTS',
    CLEAR_SEARCH_RESULTS = 'CLEAR_SEARCH_RESULTS',
}

export interface UpdateSearchTerm {
    type: ActionTypes.UPDATE_SEARCH_TERM;
    payload: string;
}

export interface UpdateSearchResults {
    type: ActionTypes.UPDATE_SEARCH_RESULTS;
    payload: SearchResult[];
}

export interface ClearSearchResults {
    type: ActionTypes.CLEAR_SEARCH_RESULTS;
    payload: string;
}

type Actions = 
    UpdateSearchTerm
    | UpdateSearchResults
    | ClearSearchResults;

export interface SearchResult {
    description?: string;
    urls?:  {
        thumb?: string
    }
  }

export interface SearchState {
    searchTerm: string;
    currentResults: SearchResult[];
}

const initState: SearchState = {
    searchTerm: '',
    currentResults: []
};

export const updateSearchTerm = (searchTerm: string): UpdateSearchTerm =>  ({type: ActionTypes.UPDATE_SEARCH_TERM, payload: searchTerm});
export const updateSearchResults = (searchResults: SearchResult[]): UpdateSearchResults =>  ({type: ActionTypes.UPDATE_SEARCH_RESULTS, payload: searchResults});
export const clearSearchResults = (): ClearSearchResults =>  ({type: ActionTypes.CLEAR_SEARCH_RESULTS, payload: ''});

export const setSearchTerm = (setSearchTerm:  string) => {
    return (dispatch) => { 
        dispatch(updateSearchTerm(setSearchTerm));
    }
}
export const searchImages = (searchTerm: string, callback: ()=> void) => {
    console.log("searchImages 1")
    return (dispatch) => {
        console.log("searchImages 2")
        dispatch(updateSearchTerm(""));
        dispatch(showMessage(""));

        if (searchTerm === ''){
            console.log("no search term ")
            dispatch(clearSearchResults())
        }
        else
        {
            console.log("search term " + searchTerm)
            unsplashSearch(searchTerm).then(response => {
                console.log(response)
                if ( response.results !== undefined && Array.isArray(response.results) && response.results.length > 0) {
                    dispatch(updateSearchResults(response.results));
                    callback();

                }
                else
                {
                    dispatch(showMessage("No Results Found"));
                }
        })
        }
    }
}

export default function(state: SearchState = initState, action: Actions): SearchState {
    switch (action.type)
    {
        case ActionTypes.UPDATE_SEARCH_TERM:
            return {...state, searchTerm: action.payload}
        case ActionTypes.UPDATE_SEARCH_RESULTS:
            return {...state, currentResults: action.payload}
        case ActionTypes.CLEAR_SEARCH_RESULTS:
            return {...state, currentResults: []}
        default:
            return state;
    }
}


