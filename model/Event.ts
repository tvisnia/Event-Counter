export default interface Event {
    title:string
    date: Date
    id: string
}

export function generateIdForEvent(event: Event) {
    return event.title + event.date.toString()
}