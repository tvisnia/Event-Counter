import React from 'react'
import { YellowBox } from 'react-native'
import EventList from './screens/EventList'
import EventForm from './screens/EventForm'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import Event from './model/EventRealmSchema'

const Realm = require('realm');

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated'
])

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

const AppNavigator = createStackNavigator({
  list: {
    screen: EventList,
    navigationOptions: () => ({
      title: 'Your Events'
    })
  },
  form: {
    screen: EventForm,
    navigationOptions: () => ({
      title: 'Add an event'
    })
  },
})

export default createAppContainer(AppNavigator)

class App extends React.Component {

  constructor(props) {
    super(props)
    console.log("App constructed.")
    this.state = {
      realm: null
    }
  }

  render() {
    console.log("schema : " + Event.getSchema())
    return <AppNavigator />
  }
}