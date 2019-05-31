import React from 'react'
import { Text, View, StyleSheet, TouchableNativeFeedback } from 'react-native'
import PropTypes from 'prop-types'
import { formatDate, getCountdownParts } from '../api'

export default class EventCard extends React.PureComponent {

    state = {
        selected: false
    }

    constructor(props) {
        super(props)
        this._onPress.bind(this)
    }


    _onPress = function (item) {
        alert(`Clicked ${item.id}`)
        // this.props.navigation.navigate('details', { item })
    }

    toggleSelectionMode = (prevState) => {
        this.setState({
            selected: !prevState.selected
        })
    }

    getEventCardRenderer = () => {
        let event = this.props.event
        const {
            days,
            hours,
            minutes,
            seconds,
        } = getCountdownParts(event.date)

        return (<View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.date}>{formatDate(event.date)}</Text>
                <Text style={styles.title}>{event.title}</Text>
            </View>
            <View style={styles.counterContainer}>
                <View
                    style={styles.counter}>
                    <Text style={styles.counterText}>{days}</Text>
                    <Text style={styles.counterLabel}>DAYS</Text>
                </View>
                <View
                    style={styles.counter}>
                    <Text style={styles.counterText}>{hours}</Text>
                    <Text style={styles.counterLabel}>HOURS</Text>
                </View>
                <View
                    style={styles.counter}>
                    <Text style={styles.counterText}>{minutes}</Text>
                    <Text style={styles.counterLabel}>MINUTES</Text>
                </View>
                <View
                    style={styles.counter}>
                    <Text style={styles.counterText}>{seconds}</Text>
                    <Text style={styles.counterLabel}>SECONDS</Text>
                </View>
            </View>
        </View>)
    }

    render() {
        return (this.getEventCardRenderer())
    }
}

EventCard.propTypes = {
    event: PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date),
        id: PropTypes.string.isRequired
    }),
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff',
        marginHorizontal: 15,
        marginBottom: 15
    },

    cardHeader: {
        flex: 1,
        flexDirection: 'row'
    },

    date: {
        fontWeight: '200',
        fontSize: 15,
        color: '#bdbdbd',
        width: '30%',
        textAlign: 'right',
    },

    title: {
        backgroundColor: 'transparent',
        fontSize: 15,
        fontWeight: '300',
        marginLeft: 7,
        textAlign: 'left'
    },

    counterContainer: {
        margin: 15,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    counter: {
        width: '25%',
        flex: 1
    },
    counterText: {
        flex: 1,
        fontSize: 40,
        textAlign: 'center'
    },
    counterLabel: {
        flex: 1,
        fontSize: 13,
        fontWeight: '100',
        color: '#a3a3a3',
        textAlign: 'center',
        paddingTop: 0
    }

})