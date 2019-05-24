import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView } from 'react-native'
import EventCard from './EventCard.js'
import { Events } from './events'
import ActionButton from 'react-native-action-button'

export default class EventList extends Component {

    state = {
        events: []
    }

    componentDidMount() {
        // console.log("")
        setInterval(() => {
            this.setState({
                events: this.state.events.map(event => ({
                    ...event,
                    timer: Date.now()
                }))
            })
        }, 1000)

        const events = Events.events.map(evt => ({
            ...evt,
            date: new Date(evt.date)
        }))
        this.setState({ events })
    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form')
    }

    render() {
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
