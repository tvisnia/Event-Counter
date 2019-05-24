import React from 'react'
import { YellowBox } from 'react-native'
import EventList from './EventList';
import EventForm from './EventForm'
import { createStackNavigator, createAppContainer } from 'react-navigation'

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated'
])

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
  render() {
    return <AppNavigator />
  }
}