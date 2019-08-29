import Event from '../../model/Event';

export enum EventActionTypes {
    ADD_EVENT = '[events] ADD_EVENT',
    REMOVE_EVENT = '[events] REMOVE_EVENT',
    UPDATE_EVENT = '[events] UPDATE_EVENT',
    REFRESH_EVENTS = '[events] REFRESH_EVENTS'
};

export interface AddEventAction { type: EventActionTypes.ADD_EVENT, payload: { event: Event } };
export interface UpdateEventAction { type: EventActionTypes.UPDATE_EVENT, payload: { event: Event } };
export interface RemoveEventAction { type: EventActionTypes.REMOVE_EVENT, payload: { id: string } };
export interface RefreshEventsAction { type: EventActionTypes.REFRESH_EVENTS };

export type EventAction = AddEventAction | RemoveEventAction | UpdateEventAction | RefreshEventsAction;

export function addEventAction(event: Event) {
    return {
        type: EventActionTypes.ADD_EVENT,
        payload: {
            event: event
        }
    }
};

export function updateEventAction(event: Event) {
    return {
        type: EventActionTypes.UPDATE_EVENT,
        payload: {
            event: event
        }
    }
};

export function removeEventAction(id: string): RemoveEventAction {
    return {
        type: EventActionTypes.REMOVE_EVENT,
        payload: {
            id: id
        }
    }
};

export const refreshEventsAction = (): RefreshEventsAction => {
    return {
        type: EventActionTypes.REFRESH_EVENTS,
    }
};
