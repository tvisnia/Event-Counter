import Event from '../model/Event'
//Realm utils
export const EVENTS_KEY = 'Event'
export const EVENT_SCHEMA = {
    schema: [{
        name: EVENTS_KEY,
        primaryKey: 'id',
        properties: {
            title: 'string',
            date: 'date',
            id: 'string'
        }
    }],
    schemaVersion: 2
}

export const sort = (a: Event, b: Event) => {
    return new Date(b.date) - new Date(a.date);
};

