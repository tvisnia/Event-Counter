import { combineReducers } from 'redux';
import * as fromEvents from './events'

export interface State {
    events: fromEvents.State
}

export const initialState: State = {
    events: fromEvents.initialState
}

export const reducer = combineReducers<State>({
    events: fromEvents.reducer
})