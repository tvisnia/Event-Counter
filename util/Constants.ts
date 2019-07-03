import Event from '../model/Event'

export const TITLE: string = 'title'
export const YOUR_EVENTS: string = 'Your events'
export const HEADER_RIGHT: string = 'headerRight'
export const DID_FOCUS: "didFocus" = "didFocus"
export const OBJECTS: string = 'Objects : '
export const OBJECTS_WRITTEN: string = 'Objects written : '
export const CANCEL: string = 'Cancel'
export const DELETE: string = 'Delete'

export const FORM_SCREEN: string = 'form'
export const DETAILS_SCREEN: string = 'details'

export const ERROR_WRITING_TO_REALM: (error: string) => string
    = (error: string) => `Problem occured while writing to Realm : ${error}`
export const ERROR_OPENING_REALM: (error: string) => string
    = (error: string) => `Problem occured while opening Realm instance : ${error}`
export const EVENTS_TO_DELETE: (count: number) => string
    = (count: number) => `Events to delete : ${count}`
export const DELETED_EVENTS: (count: number) => string
    = (count: number) => `Deleted events : ${count}.`

export const NO_EVENTS_SELECTED: string = 'Select at least one event.'
export const DELETE_WARNING: string = 'Are you sure to delete those events ?'
export const DELETE_WARNING_2: string = 'This is irreversible.'

export const EMPTY_EVENT_OR_DATE: string = 'Enter event title and date.'
export const EVENT_TITLE: string = 'Event title'
export const EVENT_DATE: string = 'Event date'

export const EVENT:string = "event"

export const SAVE_GO_BACK: string = "SAVE AND GO BACK"
export const BACK: string = "BACK"

export const CLICKED_ITEM: (item: Event) => string 
    = (item: Event) => `Clicked ${item.id}`


