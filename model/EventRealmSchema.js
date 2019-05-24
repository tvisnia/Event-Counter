export default class Event {

    static getSchema() {
        return {
            name: 'Event',
            properties: {
                title: 'string',
                date: 'date',
                id: 'string'
            }
        }

    }

}
