import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView, Text, View, TouchableNativeFeedback, Alert, ToastAndroid } from 'react-native'
import { Icon } from 'react-native-elements'
import EventCard from '../views/EventCard'
import SelectableEventCard from '../views/SelectableEventCard'
import ActionButton from 'react-native-action-button'
import { getEvents } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/Utils'

const Realm = require('realm');

var globalState = null

export default class EventList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: `${navigation.getParam('title', 'Your events')}`,
            headerRight: navigation.getParam('headerRight', null)
        }
    }

    constructor(props) {
        super(props)
        this.eventsRow = {}
    }

    state = {
        events: [],
        realm: null,
        longPressed: false,
        selectedEvents: []
    }

    componentDidMount() {
        this.rerenderEventsEverySecond()
        // this.loadSampleEvents()
        // this.addSampleEventsToRealm()
        // this.dropAllEvents()
        this.props.navigation.addListener('didFocus', () => {
            this.loadEventsFromRealm()
        })

    }

    dropAllEvents = () => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            this.setState({ realm: realm });
            try {
                realm.write(() => {
                    realm.deleteAll()
                })
                console.log("Objects : " + realm.objects(EVENTS_KEY).length)
            }
            catch (err) { console.log(`Problem occured while writing to Realm : ${err}`) }
        })
            .catch(error => console.log(`Problem occured while opening Realm instance : ${error}`
            ));
    }
    readEventsFromRealm = () => {
        let realm = this.state.realm ? this.state.realm : new Realm(EVENT_SCHEMA)
        let events = realm.objects(EVENTS_KEY)
        console.log(`Events in realm : ${events.length}`)
        this.state.realm ? globalState = { events: events } : globalState = { events: events, realm: realm }
        this.setState(globalState)
    }

    writeEventsToRealm = () => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            if (this.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    this.state.events.forEach(obj => {
                        realm.create(EVENTS_KEY, obj)
                    });
                })
                console.log("Objects written : " + realm.objects(EVENTS_KEY).length)
            }
            catch (error) { console.log(`Problem occured while opening Realm instance: ${error}`) }
        })
            .catch(error => console.log(`Problem occured while writing to Realm: ${error}`
            ));
    }

    //for test purposes
    addSampleEventsToRealm = () => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            if (this.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    realm.create(EVENTS_KEY, {
                        "title": "Przykładowe wydarzenie 1  ",
                        "date": "2019-06-15T00:00:00.000Z",
                        "id": "1001"
                    })
                    realm.create(EVENTS_KEY, {
                        "title": "Przykładowe wydarzenie 2 ",
                        "date": "2019-06-16T00:00:00.000Z",
                        "id": "1002"
                    })
                })
            }
            catch (error) { console.log(`Problem occured while opening Realm instance: ${error}`) }
        })
            .catch(error => console.log(`Problem occured while writing to Realm. Error : ${error}`
            ));
    }

    //for test purposes
    loadSampleEvents = () => {
        getEvents().then(events => {
            this.setState({ events: events })
        })
    }

    rerenderEventsEverySecond = () => {
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
        this.props.navigation.navigate('form')
    }

    loadEventsFromRealm = () => {
        this.readEventsFromRealm()
        this.rerenderEventsEverySecond()
    }

    navigateToDetailScreen = (event) => {
        this.props.navigation.navigate('details', { event: event })
    }

    toggleEventSelectionMode = () => {
        this.setState(previousState => ({
            longPressed: !previousState.longPressed
        }))
        this.toggleDeleteEventIcon()
    }

    toggleDeleteEventIcon = () => {
        this.state.longPressed ?
            this.props.navigation.setParams({
                headerRight:
                    <View style={{ marginRight: 15 }}>
                        <Icon
                            name='trash-can'
                            color='#000000'
                            type='material-community'
                            onPress={() => {
                                if (this.state.selectedEvents.length !== 0)
                                    this.showDeletionAlert()
                                else alert('Select at least one event.')
                            }} />
                    </View>,
                title: 'Select events to delete'
            }) :
            this.props.navigation.setParams({
                headerRight: null,
                title: 'Your events'
            })
    }

    showDeletionAlert = () => {
        return Alert.alert(
            'Are you sure to delete those events ?',
            'This is irreversible.',
            [
                {
                    text: 'Delete ',
                    onPress: () => {
                        this.setState({ longPressed: false })
                        this.deleteSelectedEvents()
                    }
                },
                {
                    text: 'Cancel ',
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
                    ToastAndroid.show(`Deleted events : ${this.state.selectedEvents.length}.`, ToastAndroid.SHORT)
                    this.setState({
                        selectedEvents: []
                    })
                    this.loadEventsFromRealm()
                })
            }
            catch (err) { console.log(`Problem occured while writing to Realm : ${err}`) }
        })
            .catch(error => console.log(`Problem occured while opening Realm instance : ${error}`
            ));
    }

    handleSelectableEventPress = (item) => {
        let list = this.state.selectedEvents
        let pressedItem = this.eventsRow[item.id]
        pressedItem.toggleSelection() ?
            list.push(item)
            : list = this.state.selectedEvents.filter(event => event.id !== item.id)
        this.setState({
            selectedEvents: list
        })
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {!this.state.events.length == 0 && <FlatList
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
                            onLongPress={() => this.toggleEventSelectionMode()}
                            background={TouchableNativeFeedback.Ripple("aqua", true)}>
                            <View style={{ flex: 2.8 }}>
                                {this.state.longPressed ?
                                    <SelectableEventCard
                                        event={item}
                                        ref={(SelectableEventCard) => { this.eventsRow[item.id] = SelectableEventCard }} />
                                    : <EventCard event={item} />}
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
    }
})