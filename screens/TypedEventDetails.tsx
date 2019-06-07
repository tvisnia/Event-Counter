import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Alert, Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/Utils'
import { NavigationScreenProp } from 'react-navigation'
import Event from '../model/Event'

interface Props {
    navigation: NavigationScreenProp<any,any>
};

interface State {
    modified: boolean
    title: string
    date: Date
    showDatePicker: boolean
}

export default class EventDetails extends React.Component<Props, State> {

    event: Event = null

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        let event: Event = this.event = this.props.navigation.getParam("event", {})
        this.setState({ title: event.title, date: event.date })
    }


    state: State = {
        title: null,
        date: null,
        modified: false,
        showDatePicker: false
    }

    writeEventToRealm = (title, date) => {
        Realm.open(EVENT_SCHEMA).then(realm => {
            try {
                realm.write(() => {
                    realm.create(EVENTS_KEY,
                        {
                            "title": title,
                            "date": date,
                            "id": this.event.id
                        }, true) //flag indicating update mode in realm
                })
            }
            catch (error) {
                Alert.alert(`Problem occured while writing to Realm. ${error}`)
                console.log(`Problem occured while writing to Realm. ${error}`)
            }
        })
            .catch(error => {
                Alert.alert(`Problem occured while opening Realm instance.  ${error}`)
                console.log(`Problem occured while openin Realm instance. ${error}`)
            }
            );
    }

    handleSavePress = (title, date) => {
        if (this.state.title === null || this.state.date === null)
            alert('Enter event title and date.')
        else {
            this.writeEventToRealm(title, date)
            this.props.navigation.goBack()
        }
    }

    handleChangeTitle = (value) => {
        this.setState({ modified: true, title: value })
    }

    handleDatePress = () => {
        this.setState({ showDatePicker: true })
    }

    handleDatePicked = (date) => {
        this.handleDatePickerHide()
        this.setState({ modified: true, date: date })
    }

    handleDatePickerHide = () => {
        Keyboard.dismiss()
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
                        value={formatDateTime(this.state.date)}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
                        mode='datetime'
                        onConfirm={(date) => {
                            this.handleDatePicked(date)}}
                        onCancel={() => {
                            this.handleDatePickerHide()
                        }
                        }
                    />
                </View>
                <TouchableHighlight
                    onPress={() => { this.handleSavePress(this.state.title, this.state.date) }}
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