import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView, Text, View, TouchableNativeFeedback } from 'react-native'
import EventCard from '../views/EventCard'
import ActionButton from 'react-native-action-button'
import { getEvents } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/Utils'

const Realm = require('realm');

var globalState = null

export default class EventList extends Component {

    constructor(props) {
        super(props)
    }

    state = {
        events: [],
        realm: null
    }

    componentDidMount() {
        this.rerenderEventsEverySecond()
        // this.loadSampleEvents() // data from remote server for display test
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
                        // console.log(obj.title)
                        // if (realm.objects(EVENTS_KEY).filtered(`title="${obj.title}"`).length === 0)
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

    addSampleEventsToRealm = () => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            if (this.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    // console.log(obj.title)
                    // if (realm.objects(EVENTS_KEY).filtered(`title="${obj.title}"`).length === 0)
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
                // console.log("Objects : " + realm.objects('Event').length)
            }
            catch (error) { console.log(`Problem occured while opening Realm instance: ${error}`) }
        })
            .catch(error => console.log(`Problem occured while writing to Realm. Error : ${error}`
            ));
    }

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
        this.props.navigation.navigate('details', {event: event})
    }

    render() {
        // let toLog = this.state.realm ? this.state.realm.objects('Event').length : "realm instance is null"
        // console.log(toLog)
        return (
            <SafeAreaView style={styles.container}>
                {!this.state.events.length == 0 && (<FlatList
                    style={styles.list}
                    data={this.state.events}
                    renderItem={({ item }) =>
                        // style={{
                        //     height: 70,
                        //     backgroundColor: '#48BBEC',
                        //     margin: 10,
                        //     justifyContent: 'center',
                        //     alignItems: 'center',
                        // }}
                        <TouchableNativeFeedback
                            useForeground={false}
                            background={TouchableNativeFeedback.Ripple("aqua", true)}
                            onPress={() =>this.navigateToDetailScreen(item)}>
                            <View style={{ flex: 0.8 }}>
                                <EventCard event={item} />
                            </View>
                        </TouchableNativeFeedback>
                    }
                    keyExtractor={item => item.id}
                />)
                }

                {this.state.events.length == 0 && (
                    <Text
                        style={styles.noEventsText}>No events added.</Text>)}

                <ActionButton
                    style={styles.button}
                    key="fab"
                    onPress={this.handleAddEvent}
                    buttonColor="rgba(231, 76, 60, 1)"
                >
                </ActionButton>
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