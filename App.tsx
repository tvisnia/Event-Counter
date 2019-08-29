import React from 'react'
import { YellowBox } from 'react-native'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import EventList from './screens/EventList'
import EventForm from './screens/EventForm'
import EventDetails from './screens/EventDetails';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated'
])

const AppNavigator = createStackNavigator({
  list: {
    screen: EventList,
  },
  form: {
    screen: EventForm,
    navigationOptions: () => ({
      title: 'Add an event'
    })
  },
  details: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event details'
    })
  }
})

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <AppContainer />
    )
  }
}