import React from 'react'
import { View, Text, TouchableHighlight, TextInput, StyleSheet, Alert, Keyboard } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import { formatDateTime } from '../api'
import { EVENTS_KEY, EVENT_SCHEMA } from '../util/RealmUtils'
import { NavigationScreenProp } from 'react-navigation'
import Event from '../model/Event'
import { EVENT, ERROR_WRITING_TO_REALM, ERROR_OPENING_REALM, EMPTY_EVENT_OR_DATE, EVENT_TITLE, EVENT_DATE, SAVE_GO_BACK, BACK } from '../util/Constants';

const Realm = require('realm')

interface Props {
    navigation: NavigationScreenProp<any, any>
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
        let event: Event = this.event = this.props.navigation.getParam(EVENT, {})
        this.setState({ title: event.title, date: event.date })
    }


    state: State = {
        title: null,
        date: null,
        modified: false,
        showDatePicker: false
    }

    writeEventToRealm = (title: string, date: Date) => {
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
            catch (err) {
                Alert.alert(ERROR_WRITING_TO_REALM(err))
            }
        })
            .catch(err => {
                Alert.alert(ERROR_OPENING_REALM(err))
            }
            );
    }

    handleSavePress = (title: string, date: Date) => {
        if (this.state.title && this.state.date) {
            this.writeEventToRealm(title, date)
            this.props.navigation.goBack()
        }
        else alert(EMPTY_EVENT_OR_DATE)

    }

    handleChangeTitle = (newTitle: string) => {
        this.setState({ modified: true, title: newTitle })
    }

    handleDatePress = () => {
        this.setState({ showDatePicker: true })
    }

    handleDatePicked = (date: Date) => {
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
                        placeholder={EVENT_TITLE}
                        spellCheck={false}
                        value={this.state.title}
                        onChangeText={this.handleChangeTitle}
                    />
                    <TextInput
                        style={[styles.text, styles.borderTop]}
                        placeholder={EVENT_DATE}
                        spellCheck={false}
                        value={formatDateTime(this.state.date)}
                        onFocus={this.handleDatePress}
                    />
                    <DateTimePicker
                        isVisible={this.state.showDatePicker}
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
                    onPress={() => { this.handleSavePress(this.state.title, this.state.date) }}
                    style={styles.button}
                >
                    <Text style={{ color: '#ffffff' }}>{this.state.modified ? SAVE_GO_BACK : BACK}</Text>
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