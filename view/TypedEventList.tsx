import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView, Text, View, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native'
import { Icon } from 'react-native-elements'
import EventCard from '../section/EventCard'
import SelectableEventCard from '../section/SelectableEventCard'
import ActionButton from 'react-native-action-button'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/RealmUtils'
import { NavigationScreenProp } from 'react-navigation'
import Event from '../model/Event'
import {
    TITLE, YOUR_EVENTS, HEADER_RIGHT, DID_FOCUS, OBJECTS_WRITTEN, DELETE_WARNING,
    ERROR_OPENING_REALM, ERROR_WRITING_TO_REALM, DETAILS_SCREEN, FORM_SCREEN, DELETE_WARNING_2,
    EVENTS_TO_DELETE, CANCEL, DELETE, DELETED_EVENTS, NO_EVENTS_SELECTED

} from '../util/Constants'

const Realm = require('realm');
var globalState = null

interface Props {
    navigation: NavigationScreenProp<any, any>
};

interface State {
    events: Event[],
    selectedEvents: Event[],
    realm: any,
    longPressed: boolean,
}

export default class TypedEventList extends Component<Props, State> {

    eventsRow

    state: State = {
        events: [],
        selectedEvents: [],
        realm: null,
        longPressed: false,
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.getParam(TITLE, YOUR_EVENTS)}`,
            headerRight: navigation.getParam(HEADER_RIGHT, null),
        }
    }

    constructor(props: Props) {
        super(props)
        this.eventsRow = {}
    }

    componentDidMount() {
        this.tick()
        this.props.navigation.addListener(DID_FOCUS, () => {
            this.loadEventsFromRealm()
        })
    }

    readEventsFromRealm = () => {
        let realm = this.state.realm ? this.state.realm : new Realm(EVENT_SCHEMA)
        let events = realm.objects(EVENTS_KEY)
        this.state.realm ? globalState = { events: events } : globalState = { events: events, realm: realm }
        this.setState(globalState)
    }

    writeEventsToRealm = () => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            if (this.state.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    this.state.events.forEach(obj => {
                        realm.create(EVENTS_KEY, obj)
                    });
                })
                console.log(OBJECTS_WRITTEN + realm.objects(EVENTS_KEY).length)
            }
            catch (err) { console.log(ERROR_WRITING_TO_REALM(err)) }
        })
            .catch(err => console.log(ERROR_OPENING_REALM(err)));
    }

    tick = () => {
        setInterval(() => {
            this.setState({
                events: this.state.events.map(event => ({
                    ...event,
                    timer: Date.now()
                }))
            })
        }, 1000)

    }

    handleAddEvent = () => {
        this.props.navigation.navigate(FORM_SCREEN)
    }

    loadEventsFromRealm = () => {
        this.readEventsFromRealm()
        this.tick()
    }

    navigateToDetailScreen = (event: Event) => {
        this.props.navigation.navigate(DETAILS_SCREEN, { event: event })
    }

    toggleEventSelectionMode = () => {
        this.setState(previousState => ({
            longPressed: !previousState.longPressed
        }))
        this.toggleDeleteEventIcon()
    }

    toggleDeleteEventIcon = () => {
        const { longPressed, selectedEvents } = this.state
        longPressed ?
            this.props.navigation.setParams({
                headerRight:
                    <View style={{ marginRight: 15 }}>
                        <Icon
                            name='trash-can'
                            color='#000000'
                            type='material-community'
                            onPress={() => {
                                if (selectedEvents.length !== 0)
                                    this.showDeletionAlert()
                                else alert(NO_EVENTS_SELECTED)
                            }} />

                    </View>,
                title: EVENTS_TO_DELETE(selectedEvents.length)
            }) :
            this.props.navigation.setParams({
                headerRight: null,
                headerCenter: null,
                title: YOUR_EVENTS
            })
    }

    showDeletionAlert = () => {
        return Alert.alert(
            DELETE_WARNING,
            DELETE_WARNING_2,
            [
                {
                    text: DELETE,
                    onPress: () => {
                        this.setState({ longPressed: false })
                        this.deleteSelectedEvents()
                    }
                },
                {
                    text: CANCEL,
                    onPress: () => {
                        this.setState({ longPressed: false })
                        this.toggleDeleteEventIcon()
                    },
                    style: 'cancel'
                }],
            { cancelable: true }
        )
    }

    deleteSelectedEvents = () => {
        this.toggleDeleteEventIcon()
        Realm.open(EVENT_SCHEMA).then(realm => {
            this.setState({ realm: realm });
            try {
                realm.write(() => {
                    this.state.selectedEvents.forEach(
                        event => realm.delete(realm.objectForPrimaryKey(EVENTS_KEY, event.id))
                    )
                    ToastAndroid.show(DELETED_EVENTS(this.state.selectedEvents.length), ToastAndroid.SHORT)
                    this.setState({
                        selectedEvents: []
                    })
                    this.loadEventsFromRealm()
                })
            }
            catch (err) { console.log(ERROR_WRITING_TO_REALM(err)) }
        })
            .catch(err => console.log(ERROR_OPENING_REALM(err)
            ));
    }

    handleSelectableEventPress = (item: Event) => {
        let list = this.state.selectedEvents
        let pressedItem = this.eventsRow[item.id]
        if (pressedItem.toggleSelection()) {
            list.push(item)
            this.setState({
                selectedEvents: list
            })
        }
        else {
            let indexToDelete = list.indexOf(item)
            list.splice(indexToDelete, 1)
            this.setState({
                selectedEvents: list
            })
        }
        this.updateTitle()

    }

    updateTitle = () => {
        this.props.navigation.setParams({
            title: EVENTS_TO_DELETE(this.state.selectedEvents.length)
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {!(this.state.events.length == 0) && <FlatList
                    style={styles.list}
                    data={this.state.events}
                    renderItem={({ item }) =>
                        <TouchableNativeFeedback
                            useForeground={false}
                            onPress={() => {
                                this.state.longPressed ?
                                    this.handleSelectableEventPress(item)
                                    : this.navigateToDetailScreen(item)
                            }}
                            onLongPress={
                                () => this.toggleEventSelectionMode()
                            }>
                            <View style={{ flex: 2.8 }}>
                                {this.state.longPressed ?
                                    <SelectableEventCard
                                        event={item}
                                        ref={(SelectableEventCard) => { this.eventsRow[item.id] = SelectableEventCard }} />
                                    : <EventCard
                                        event={item} />}
                            </View>
                        </TouchableNativeFeedback>
                    }
                    keyExtractor={item => item.id}
                />
                }

                {this.state.events.length == 0 && (
                    <Text
                        style={styles.noEventsText}>No events added.</Text>)}

                {this.state.longPressed === false && <ActionButton
                    style={styles.button}
                    key="fab"
                    onPress={this.handleAddEvent}
                    buttonColor="rgba(231, 76, 60, 1)"
                >
                </ActionButton>}
            </SafeAreaView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f3f3f3',
        flex: 1,
    },
    noEventsText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 20,
    },
    list: {
        flex: 1,
        paddingTop: 20,
    },
    button: {
        position: 'absolute'
    },
    toDeleteCounter: {
        color: '#000000'
    }
})