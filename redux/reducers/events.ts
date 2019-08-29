import Event, { generateId } from '../../model/Event'
import { EventActionTypes, EventAction } from '../actions/events';

export interface State {
    events: Event[]
}

export const initialState: State = {
    events: []
}

export function reducer(state: State = initialState, action: EventAction) {
    const { events } = state;

    switch (action.type) {
        case EventActionTypes.ADD_EVENT: {
            const toAdd = action.payload.event;
            return {
                ...state,
                events: [...events, toAdd]
            }
        }
        case EventActionTypes.REMOVE_EVENT: {
            const idToRemove = action.payload.id;
            const newArr = events.filter(e => e.id !== idToRemove);
            return {
                ...state,
                events: [...newArr]
            };
        }
        case EventActionTypes.UPDATE_EVENT: {
            const newEvent = action.payload.event;
            const { title, date } = newEvent
            const newArr = events.map(e => {
                if (e.id === newEvent.id) {
                    return { ...newEvent, id: generateId(title, date) }
                }
            })
            return {
                ...state,
                events: [...newArr]
            }
        }
        case EventActionTypes.REFRESH_EVENTS: {
            return {
                ...state,
                events: [...events]
            };
        }
        default:
            return state;
    }
}