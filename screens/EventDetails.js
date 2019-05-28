import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Alert } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/Utils'



export default class EventDetails extends React.Component {

    event = navigation.getParam("event", {})
    state = {
        modified: false,
    }

    writeEventToRealm = ({ title, date }) => {
        Realm.open(EVENT_SCHEMA.schema).then(realm => {
            if (this.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    realm.create(EVENTS_KEY,
                        {
                            "id": event.id,
                            "title": title,
                            "date": date,
                        }, true) //flag indicating update mode in realm
                })
            }
            catch (error) { Alert.alert(`Problem occured while opening Realm instance: ${error}`) }
        })
            .catch(error => Alert.alert(`Problem occured while writing to Realm. Error : ${error}`
            ));
    }

    handleSavePress = () => {
        if (this.state.title === null || this.state.date === null)
            Alert.alert('Enter event title and date.')
        else {
            this.writeEventToRealm(this.state.title, this.state.date)
            navigation.goBack()
        }
    }

    handleChangeTitle = (value) => {
        this.setState({ modified: true, title: value })
    }

    handleDatePress = () => {
        this.setState({ showDatepropPicker: true })
    }

    handleDatePicked = (date) => {
        this.setState({ modified: true, date: date })
    }

    handleDatePickerHide = () => {
        this.setState({ showDatePicker: false })
    }

    render() {
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
                        value={this.state.title}
                        onChangeText={this.handleChangeTitle}
                    />
                    <TextInput
                        style={[styles.text, styles.borderTop]}
                        placeholder="Event date"
                        spellCheck={false}
                        value={formatDateTime(this.state.date.toString())}
                        editable={this.state.showDatePicker}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode='datetime'
                        onConfirm={this.handleDatePicked}
                        onCancel={this.handleDatePickerHide}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.handleSavePress}
                    style={styles.button}
                >
                    <Text style={{ color: '#ffffff' }}>{this.state.modified ? "SAVE AND GO BACK" : "BACK"}</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

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