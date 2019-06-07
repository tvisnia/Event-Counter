import React from 'react'
import { YellowBox } from 'react-native'
import TypedEventList from './screens/TypedEventList'
import TypedEventForm from './screens/TypedEventForm'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import TypedEventDetails from './screens/TypedEventDetails';

YellowBox.ignoreWarnings([
  'Warning: componentWillMount is deprecated',
  'Warning: componentWillReceiveProps is deprecated'
])

const AppNavigator = createStackNavigator({
  list: {
    screen: TypedEventList,
  },
  form: {
    screen: TypedEventForm,
    navigationOptions: () => ({
      title: 'Add an event'
    })
  },
  details: {
    screen: TypedEventDetails,
    navigationOptions: () => ({
      title: 'Event details'
    })
  }
})

export default createAppContainer(AppNavigator)

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return <AppNavigator />
  }
}