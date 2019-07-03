import { TOGGLE_SELECTION_MODE} from '../actions/types'

const initialState = false

export default(state = initialState, action) => {
    switch(action.type) {
        case TOGGLE_SELECTION_MODE:
            return !state
        default:
            return state
    }
}