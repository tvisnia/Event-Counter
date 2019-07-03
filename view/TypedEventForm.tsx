import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Alert, Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/RealmUtils'
import { NavigationScreenProp } from 'react-navigation'
import { ERROR_WRITING_TO_REALM, ERROR_OPENING_REALM, EMPTY_EVENT_OR_DATE, EVENT_TITLE, EVENT_DATE } from '../util/Constants';

const Realm = require('realm')

interface Props {
    navigation: NavigationScreenProp<any, any>
};

interface State {
    title: string
    date: Date
    realm: any
    showDatePicker: boolean
}


export default class TypedEventForm extends React.Component<Props, State> {

    state: State = {
        title: null,
        date: null,
        realm: null,
        showDatePicker: false,
    }

    writeEventToRealm = ({ title, date }) => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            if (this.state.realm == null) this.setState({ realm: realm });
            try {
                realm.write(() => {
                    realm.create(EVENTS_KEY, {
                        "title": title,
                        "date": date,
                        "id": title + date.toString()
                    })
                })
            }
            catch (err) { Alert.alert(ERROR_WRITING_TO_REALM(err)) }
        })
            .catch(err => Alert.alert(ERROR_OPENING_REALM(err)
            ));
    }

    handleAddPress = () => {
        if (this.state.title === null || this.state.date === null)
            Alert.alert(EMPTY_EVENT_OR_DATE)
        else {
            this.writeEventToRealm(this.state)
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
        return (
            <View
                style={{
                    flex: 1
                }}>
                <View style={styles.fieldContainer}>
                    <TextInput
                        style={styles.text}
                        placeholder={EVENT_TITLE}
                        spellCheck={false}
                        value={this.state.title}
                        onChangeText={this.handleChangeTitle}
                    />
                    <TextInput
                        style={[styles.text, styles.borderTop]}
                        placeholder={EVENT_DATE}
                        spellCheck={false}
                        value={(formatDateTime(this.state.date ? this.state.date.toString() : ''))}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode='datetime'
                        onConfirm={(date) => this.handleDatePicked(date)}
                        onCancel={() => this.handleDatePickerHide()}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.handleAddPress}
                    style={styles.button}
                >
                    <Text style={{ color: '#ffffff' }}>ADD</Text>
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