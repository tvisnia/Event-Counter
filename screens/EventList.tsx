import React, { Component } from 'react'
import { FlatList, StyleSheet, SafeAreaView, Text, View, Alert, Animated } from 'react-native'
import { connect } from "react-redux";
import { Icon } from 'react-native-elements'
import SelectableEventCard from '../views/SelectableEventCard'
import ActionButton from '../views/ActionButton'
import { NavigationScreenProp } from 'react-navigation'
import Event from '../model/Event'
import { removeEventAction, refreshEventsAction } from '../redux/actions/events'
import Header from '../views/Header';

interface Props {
    navigation: NavigationScreenProp<any, any>
    events: Event[];
    removeEvent: (id: string) => void;
    refreshEvents: () => void;
};

interface State {
    selectedEvents: string[],
    realm: any,
    longPressed: boolean,
    actionButtonVisible: boolean,
    fadeAnim: Animated.Value
}

class EventList extends Component<Props, State> {

    state: State = {
        selectedEvents: [],
        realm: null,
        longPressed: false,
        actionButtonVisible: true,
        fadeAnim: new Animated.Value(1)
    }

    static navigationOptions = {
        header: null
    }

    componentWillMount() {
        this.props.navigation.addListener('didFocus', () => {
            this.tick();
        })
    }

    tick = () => {
        setInterval(() => {
            this.props.refreshEvents();
        }, 1000)

    }

    handleAddEvent = () => {
        this.props.navigation.navigate('form')
    }

    navigateToDetailScreen = (event: Event) => {
        this.props.navigation.navigate('details', { event: event })
    }

    toggleEventSelectionMode = () => {
        this.setState(prevState => ({
            longPressed: !prevState.longPressed
        }))
    }

    onDeletePress = () => {
        if (this.state.selectedEvents.length !== 0)
            this.showDeletionAlert()
        else alert('Select at least one event.')
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
                title: `Events to delete : ${this.state.selectedEvents.length}`
            }) :
            this.props.navigation.setParams({
                headerRight: null,
                headerCenter: null,
                title: 'Your events'
            })
    }

    showDeletionAlert = () => {
        return Alert.alert(
            'Are you sure to delete those events ?',
            'This is irreversible.',
            [
                {
                    text: 'Delete',
                    onPress: () => {
                        this.setState({ longPressed: false })
                        this.deleteSelectedEvents()
                    }
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                        this.setState({ longPressed: false })
                    },
                    style: 'cancel'
                }],
        )
    }

    deleteSelectedEvents = () => {
        const { selectedEvents } = this.state;
        selectedEvents.forEach(id => this.props.removeEvent(id));
    }

    updateSelectedEventsList = (eventId: string, selected: boolean) => {
        let list = this.state.selectedEvents
        let updateState = selected ? () => {
            this.setState({
                selectedEvents: [...this.state.selectedEvents, eventId]
            })
        } : () => {
            let indexToDelete = list.indexOf(eventId)
            list.splice(indexToDelete, 1)
            this.setState({
                selectedEvents: list
            })
        }
        updateState();
        this.updateTitle()
    }

    updateTitle = () => {
        this.props.navigation.setParams({
            title: `Events to delete : ${this.state.selectedEvents.length}`
        })
    }

    onScrollBegin = () => {
        this.setState({ actionButtonVisible: false })
    }

    onScrollEnd = () => {
        this.setState({ actionButtonVisible: true })
    }

    render() {
        const { events } = this.props;
        const { longPressed, selectedEvents, actionButtonVisible } = this.state;
        return (
            <SafeAreaView style={styles.container} >
                <Header
                    onDeletePress={this.onDeletePress}
                    defaultTitle={'Your events'}
                    selectionMode={longPressed}
                    selected={selectedEvents.length}
                />
                {
                    events.length !== 0 &&
                    <FlatList
                        style={styles.list}
                        contentContainerStyle={{ paddingBottom: 25 }}
                        data={events}
                        renderItem={({ item }) =>
                            <SelectableEventCard
                                event={item}
                                selectionMode={longPressed}
                                onPress={() => this.navigateToDetailScreen(item)}
                                onLongPress={this.toggleEventSelectionMode}
                                updateSelectedEventsList={this.updateSelectedEventsList}
                            />
                        }
                        keyExtractor={item => item.id}
                        onScrollBeginDrag={this.onScrollBegin}
                        onScrollEndDrag={this.onScrollEnd}
                    />
                }
                {
                    events.length === 0 && (
                        <Text style={styles.noEventsText}>No events added.</Text>)
                }
                {
                    longPressed === false &&
                    <View style={{ bottom: 10, right: 10, zIndex: 5, position: "absolute" }}>
                        <ActionButton
                            onPress={this.handleAddEvent}
                            visible={actionButtonVisible}
                        />
                    </View>
                }
            </SafeAreaView>
        )
    }
}

const mapStateToProps = state => {
    return {
        events: state.events.events
    }
}

const mapDispatchToProps = dispatch => {
    return {
        removeEvent: (id: string) => dispatch(removeEventAction(id)),
        refreshEvents: () => dispatch(refreshEventsAction())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EventList)

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
        paddingTop: 20,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        width: 60,
        height: 60,
        elevation: 5,
    },
})