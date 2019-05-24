import moment from 'moment'


const url = 'https://jsonstorage.net/api/items/a9db966a-caeb-4c7e-a917-32a1d3aa9b20'

export function getEvents() {
    return fetch(url)
        .then(response =>
            response.json()
        )
        .then(events => events.map(event => ({
            ...event,
            date: new Date(event.date)
        }))
        )
}

export function formatDate(dateString) {
    const parsed = moment(new Date(dateString))


    if (!parsed.isValid()) {
        return dateString
    }

    return parsed.format('D MMM YYYY')
}

export function formatDateTime(dateString) {
    const parsed = moment(new Date(dateString))

    if (!parsed.isValid()) {
        return dateString
    }

    return parsed.format('H A on D MMM YYYY')
}

export function getCountdownParts(eventDate) {
    const duration = moment.duration(moment(new Date(eventDate)).diff(new Date()))
    return {
        days: parseInt(duration.as('days')),
        hours: duration.get('hours'),
        minutes: duration.get('minutes'),
        seconds: duration.get('seconds'),
    }
}