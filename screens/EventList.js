import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView } from 'react-native'
import EventCard from '../views/EventCard'
import ActionButton from 'react-native-action-button'
import { getEvents } from '../api'
import Event from '../model/EventRealmSchema'

const Realm = require('realm');

const dbOptions = {
    schema: [{
        name: 'Event',
        properties: {
            title: 'string',
            date: 'date',
            id: 'string'
        }
    }]
}

export default class EventList extends Component {

    state = {
        events: [],
        realm: null
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                events: this.state.events.map(event => ({
                    ...event,
                    timer: Date.now()
                }))
            })
        }, 1000)

        // const events = Events.events.map(evt => ({
        //     ...evt,
        //     date: new Date(evt.date)
        // }))
        // this.setState({events})

        getEvents().then(events => {
            let realm = this.state.realm
            this.setState({ events: events })
            writeEventsToRealm()
            // dropAllEvents()
        })

        dropAllEvents = () => {
            Realm.open(dbOptions).then(realm => {
                this.setState({ realm: realm });
                try {
                    realm.write(() => {
                        realm.deleteAll()
                    })
                    console.log("Objects : " + realm.objects('Event').length)
                }
                catch (err) { console.log(`1Problem occured while writing to Realm. Error : ${err}`) }
            })
                .catch(error => console.log(`2Problem occured while writing to Realm. Error : ${error}`
                ));
        }
        writeEventsToRealm = () => {
            Realm.open(dbOptions).then(realm => {
                this.setState({ realm: realm });
                try {
                    realm.write(() => {
                        this.state.events.forEach(obj => {
                            console.log(obj.title)
                            if (realm.objects('Event').filtered(`title="${obj.title}"`).length === 0)
                                realm.create('Event', obj)
                        });
                    })
                    console.log("Objects : " + realm.objects('Event').length)
                }
                catch (err) { console.log(`1Problem occured while writing to Realm. Error : ${err}`) }
            })
                .catch(error => console.log(`2Problem occured while writing to Realm. Error : ${error}`
                ));
        }

        //   Realm.open(dbOptions).then(realm => {
        //     console.log(realm.objects('Event').length)
        //   })
        // // events = realm.objects('Event')
        // this.setState(events)
        // console.log("Events : " + events.length)
    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form')
    }

    render() {
        let toLog = this.state.realm ? this.state.realm.objects('Event').length : "realm instance is null"
        console.log(toLog)
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    style={styles.list}
                    data={this.state.events}
                    renderItem={({ item, separators }) => (
                        <EventCard event={item} />)}
                    keyExtractor={item => item.id}
                />

                <ActionButton
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
    list: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: '#F3F3F3'
    }
})
