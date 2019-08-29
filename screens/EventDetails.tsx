import React from 'react'
import { connect } from "react-redux";
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { NavigationScreenProp } from 'react-navigation'
import Event from '../model/Event'
import { updateEventAction } from '../redux/actions/events';

interface Props {
    navigation: NavigationScreenProp<any, any>;
    updateEvent: (e: Event) => void;
};

interface State {
    event: Event
    modified: boolean
    showDatePicker: boolean
}

export class EventDetails extends React.Component<Props, State> {

    componentWillMount() {
        const event = this.props.navigation.getParam("event", {})
        this.setState({ event: event })
    }

    state: State = {
        event: null,
        modified: false,
        showDatePicker: false
    }

    handleSavePress = () => {
        const { updateEvent, navigation } = this.props;
        const { event } = this.state;
        const { title, date } = event;
        if (title === null || date === null)
            alert('Enter event title and date.');
        else {
            updateEvent(event);
            navigation.goBack();
        }
    }

    handleChangeTitle = (value: string) => {
        this.setState(prevState => ({
            modified: true,
            event: { ...prevState.event, title: value }
        }))
    }

    handleDatePress = () => {
        this.setState({ showDatePicker: true })
    }

    handleDatePicked = (date: Date) => {
        this.handleDatePickerHide()
        this.setState(prevState => ({
            modified: true,
            event: { ...prevState.event, date: date }
        }))
    }

    handleDatePickerHide = () => {
        Keyboard.dismiss()
        this.setState({ showDatePicker: false })
    }

    render() {
        const { modified, showDatePicker, event } = this.state;
        const { title, date } = event
        return (
            <View
                style={{
                    flex: 1
                }}>
                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.text}
                        placeholder="Event title"
                        spellCheck={false}
                        value={title}
                        onChangeText={this.handleChangeTitle}
                    />
                    <TextInput
                        style={[styles.text, styles.borderTop]}
                        placeholder="Event date"
                        spellCheck={false}
                        value={formatDateTime(date)}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={showDatePicker}
                        mode='datetime'
                        onConfirm={(date) => {
                            this.handleDatePicked(date)
                        }}
                        onCancel={() => {
                            this.handleDatePickerHide()
                        }
                        }
                    />
                </View>
                <TouchableHighlight
                    onPress={() => { this.handleSavePress() }}
                    style={styles.button}
                >
                    <Text style={{ color: '#ffffff' }}>{modified ? "SAVE AND GO BACK" : "BACK"}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateEvent: (e: Event) => dispatch(updateEventAction(e))
    }
}

export default connect(
    null,
    mapDispatchToProps
)(EventDetails)

const styles = StyleSheet.create({
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff'
    },
    text: {
        height: 40,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 18
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5
    }
})