import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Alert, Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { connect } from "react-redux";
import { addEventAction } from '../redux/actions/events'
import { NavigationScreenProp } from 'react-navigation'
import Event, { createEvent } from '../model/Event';

interface Props {
    navigation: NavigationScreenProp<any, any>
    addEvent: (event: Event) => void;
};

interface State {
    title: string
    date: Date
    realm: any
    showDatePicker: boolean
    eventAdded: boolean
}

class EventForm extends React.Component<Props, State> {

    state: State = {
        title: null,
        date: null,
        realm: null,
        showDatePicker: false,
        eventAdded: false
    }

    handleAddPress = () => {
        const { title, date, eventAdded } = this.state;
        if (this.state.title === null || this.state.date === null)
            Alert.alert('Enter event title and date.');
        else {
            this.props.addEvent(createEvent(title, date));
            this.setState({ eventAdded: !eventAdded })
            this.props.navigation.goBack()
        }
    }

    handleChangeTitle = (value: string) => {
        this.setState({ title: value })
    }

    handleDatePress = () => {
        this.setState({ showDatePicker: true })
    }

    handleDatePicked = (date: Date) => {
        this.handleDatePickerHide()
        this.setState({ date, })
    }

    handleDatePickerHide = () => {
        this.setState({ showDatePicker: false })
        Keyboard.dismiss()
    }

    render() {
        const { showDatePicker, date, title, eventAdded } = this.state;
        return (
            <View style={{ flex: 1 }}>
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
                        value={(formatDateTime(date ? date.toString() : ''))}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={showDatePicker}
                        mode='datetime'
                        onConfirm={this.handleDatePicked}
                        onCancel={this.handleDatePickerHide}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.handleAddPress}
                    style={styles.button}
                    disabled={eventAdded}
                >
                    <Text style={{ color: '#ffffff' }}>ADD</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEvent: (evt: Event) => dispatch(addEventAction(evt)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(EventForm)

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