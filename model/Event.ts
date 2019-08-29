export default interface Event {
    title: string
    date: Date
    id: string
}

export const createEvent = (title: string, date: Date): Event => {
    const id: string = generateId(title, date);
    return {
        title: title,
        date: date,
        id: id
    }
}

export const generateId = (title: string, date: Date): string => {
    return title + date.toString()
}