import { TURN_ON_SELECTION_MODE, TURN_OFF_SELECTION_MODE } from './types'

export const turnOnSelectionMode = () => {
    return { type: TURN_ON_SELECTION_MODE }
}

export const turnOffSelectionMode = () => {
    return { type: TURN_OFF_SELECTION_MODE }
}