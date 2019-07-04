import {combineReducers} from 'redux'
import selectionModeReducer from './selectionModeReducer'

export default combineReducers({
    selectionMode: selectionModeReducer
})