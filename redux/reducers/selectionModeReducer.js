import { TURN_SELECTION_MODE_ON} from '../actions/types'

const initialState = false

export default(state = initialState, action) => {
    switch(action.type) {
        case TURN_SELECTION_MODE_ON:
            return !state
        default:
            return state
    }
}