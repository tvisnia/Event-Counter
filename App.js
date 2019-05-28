import React from 'react'
import { YellowBox } from 'react-native'
import EventList from './screens/EventList'
import EventForm from './screens/EventForm'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import EventDetails from './screens/EventDetails';

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
  details: {
    screen: EventDetails,
    navigationOptions: () => ({
      title: 'Event details'
    })
  }
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
    return <AppNavigator />
  }
}