import { TURN_ON_SELECTION_MODE, TURN_OFF_SELECTION_MODE } from '../actions/types'

const initialState = {
    selectionMode: false
}

export default selectionModeReducer = (state = initialState, action) => {
    console.log(`Action type : ${action.type}`)
    console.log(`Current selectionMode : ${state.selectionMode}`)
    switch (action.type) {
        case TURN_ON_SELECTION_MODE:
            return {
                ...state,
                selectionMode: true
            }
        case TURN_OFF_SELECTION_MODE:
            return {
                ...state,
                selectionMode: false
            }
        default:
            return {
                ...state,
                selectionMode: false
            }
    }
}