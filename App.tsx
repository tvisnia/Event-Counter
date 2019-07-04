import React from 'react'
import { YellowBox } from 'react-native'
import TypedEventList from './view/TypedEventList'
import TypedEventForm from './view/TypedEventForm'
import { createStackNavigator, createAppContainer } from 'react-navigation'
import TypedEventDetails from './view/TypedEventDetails';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import combineReducers from './redux/reducers/index'

const store = createStore(combineReducers)

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

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>)
  }
}